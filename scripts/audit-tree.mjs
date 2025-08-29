#!/usr/bin/env node
/**
 * AFW Tree Auditor — verifies required files exist before pushing to GitHub/Vercel.
 * Usage: node scripts/audit-tree.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const RULES = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'audit-rules.json'), 'utf-8'));

const out = { ok: true, findings: [], ts: new Date().toISOString() };

function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }
function push(ok, area, message, hint){
  out.ok = out.ok && ok;
  out.findings.push({ ok, area, message, hint });
}
function req(file, area, hint=''){
  const p = path.join(ROOT, file);
  if (exists(p)) push(true, area, `OK: ${file}`);
  else push(false, area, `MISSING: ${file}`, hint);
}
function reqAny(files, area, hint=''){
  const hit = files.find(f => exists(path.join(ROOT, f)));
  if (hit) push(true, area, `OK: any-of present → ${hit}`);
  else { push(false, area, `MISSING: all-of [${files.join(', ')}]`, hint); }
}
function checkJSON(file, area){
  const p = path.join(ROOT, file);
  if (!exists(p)){ push(false, area, `MISSING: ${file}`); return; }
  try { JSON.parse(fs.readFileSync(p, 'utf-8')); push(true, area, `OK: JSON valid → ${file}`); }
  catch(e){ push(false, area, `INVALID JSON: ${file}`, e.message); }
}

function check(){
  // Vite core
  req('package.json', 'core', 'Must include "build": "vite build".');
  req('vite.config.ts', 'core', 'Ensure aliases match imports.');
  req('tsconfig.json', 'core', 'Include "paths" if using aliases.');
  req('index.html', 'core');

  // Pages
  for (const name of RULES.pages){ req(`src/pages/${name}.tsx`, 'pages'); }

  // Components
  for (const f of RULES.components){ req(`src/${f}`, 'components'); }

  // Styles aggregator
  req('src/styles/index.ts', 'styles', 'Should import globals.css, scene.css, audio.css, journal.css, tokens.css, a11y.css, home.css, qa.css');

  // Guards
  req('src/guards/clipboard.ts', 'guards');

  // Scenes: plates per theme
  for (const theme of RULES.themes){
    for (const layer of ['back','mid','front']){
      req(`public/assets/scenes/${theme}/plates/${layer}.webp`, `scenes:${theme}`, 'Add real plates to avoid flat backgrounds.');
    }
  }

  // Stems per theme (mp3 or ogg)
  for (const theme of RULES.themes){
    for (const stem of RULES.stems){
      reqAny([`public/assets/audio/${theme}/stems/${stem}.mp3`, `public/assets/audio/${theme}/stems/${stem}.ogg`], `stems:${theme}`, `Provide ${stem}.mp3 (or .ogg).`);
    }
  }

  // Fonts
  req('public/fonts.css', 'fonts', 'Must reference /assets/fonts/...');
  if (!exists(path.join(ROOT, 'public/assets/fonts/ui'))) {
    push(false, 'fonts', 'MISSING: public/assets/fonts/ui (woff2 files)');
  } else {
    push(true, 'fonts', 'OK: fonts ui folder present');
  }

  // Content manifests
  checkJSON('public/content/quotes.manifest.json', 'content');
  checkJSON('public/content/devotionals.manifest.json', 'content');

  // Narration
  req('public/narration/tracks', 'narration', 'Add MP3/OGG narration files as ready.');
  req('public/narration/captions', 'narration', 'Add VTT caption files as ready.');

  // Avatars — Healing required loops (MP4 at minimum)
  for (const state of RULES.healing_required_loops){
    const mp4 = `public/assets/avatars/healing/${state}/mp4/${state}.mp4`;
    const webm = `public/assets/avatars/healing/${state}/webm/${state}.webm`;
    reqAny([mp4], `avatars:healing:${state}`, `Export H.264 MP4 to ${mp4}`);
    if (exists(path.join(ROOT, mp4))) {
      if (exists(path.join(ROOT, webm))) push(true, `avatars:healing:${state}`, `OK: WEBM present → ${webm}`);
      else push(true, `avatars:healing:${state}`, `OK: MP4 present; WEBM optional`);
    } else {
      reqAny([webm], `avatars:healing:${state}`, `Alternatively supply WEBM at ${webm}`);
    }
  }

  // Avatars — Journey required loops (MP4 at minimum)
  for (const state of RULES.journey_required_loops){
    const mp4 = `public/assets/avatars/journey/${state}/mp4/${state}.mp4`;
    const webm = `public/assets/avatars/journey/${state}/webm/${state}.webm`;
    reqAny([mp4], `avatars:journey:${state}`, `Export H.264 MP4 to ${mp4}`);
    if (exists(path.join(ROOT, mp4))) {
      if (exists(path.join(ROOT, webm))) push(true, `avatars:journey:${state}`, `OK: WEBM present → ${webm}`);
      else push(true, `avatars:journey:${state}`, `OK: MP4 present; WEBM optional`);
    } else {
      reqAny([webm], `avatars:journey:${state}`, `Alternatively supply WEBM at ${webm}`);
    }
  }

  // Next-wave actions (informational)
  for (const state of RULES.healing_actions_next){
    const mp4 = `public/assets/avatars/healing/${state}/mp4/${state}.mp4`;
    if (exists(path.join(ROOT, mp4))) push(true, `avatars:healing:next`, `OK (optional now): ${mp4}`);
    else push(true, `avatars:healing:next`, `TODO (plan next): ${mp4}`);
  }
  for (const state of RULES.journey_next){
    const mp4 = `public/assets/avatars/journey/${state}/mp4/${state}.mp4`;
    if (exists(path.join(ROOT, mp4))) push(true, `avatars:journey:next`, `OK (optional now): ${mp4}`);
    else push(true, `avatars:journey:next`, `TODO (plan next): ${mp4}`);
  }

  return out;
}

const report = check();
const outPath = path.join(ROOT, 'scripts', 'last-audit.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
const okEmoji = report.ok ? '✅' : '⚠️';
console.log(okEmoji, 'AFW Tree Audit complete. Findings saved to scripts/last-audit.json');
for (const f of report.findings){
  const tag = f.ok ? '[OK]' : '[MISS]';
  console.log(tag, f.area, '-', f.message, f.hint ? `\n      ↪ hint: ${f.hint}` : '');
}
process.exit(0);
