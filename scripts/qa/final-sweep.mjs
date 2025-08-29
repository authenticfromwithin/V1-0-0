#!/usr/bin/env node
/**
 * AFW Final Sweep — predeploy integrity checks.
 * - Validates devotionals manifest vs files (365 entries for 2025)
 * - Confirms quotes manifest categories exist
 * - Verifies audio stems per theme (wind, water, leaves, birds, pad)
 * - Checks avatar idle clips for healing & journey for variant-01/02 (webm+mp4)
 * - Verifies fonts presence (.woff2) for ui/
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const join = (...s) => path.join(ROOT, ...s);
let errors = [];
let warns = [];

function has(p) { return fs.existsSync(join(...(Array.isArray(p)?p:[p]))); }
function requireHas(p, msg) { if (!has(p)) errors.push(msg+' → '+(Array.isArray(p)?p.join('/'):p)); }

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(join(...(Array.isArray(p)?p:[p])), 'utf8')); }
  catch(e) { errors.push('JSON read failed: '+(Array.isArray(p)?p.join('/'):p)+' :: '+e.message); return null; }
}

function glob(dir, ext) {
  const abs = join(dir);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const name of fs.readdirSync(abs)) {
    const p = path.join(abs, name);
    if (fs.statSync(p).isDirectory()) out.push(...glob(path.join(dir, name), ext));
    else if (!ext || p.endsWith(ext)) out.push(p);
  }
  return out;
}

function checkDevotionals(){
  const manifest = readJSON(['public','content','devotionals.manifest.json'])||[];
  if (!Array.isArray(manifest) || manifest.length < 365) {
    errors.push(`Devotionals manifest should have ≥365 entries; got ${manifest.length||0}`);
  }
  let missing = 0;
  for (const d of manifest) {
    const month = (d.id||'').slice(0,7);
    const pathRel = ['public','content','devotionals',month,`devotional-${d.id}.json`];
    if (!has(pathRel)) missing++;
  }
  if (missing) errors.push(`Devotional files missing: ${missing} entries not found on disk`);
}

function checkQuotes(){
  const qm = readJSON(['public','content','quotes.manifest.json']);
  if (!qm || !Array.isArray(qm.categories) || qm.categories.length < 4) {
    errors.push('Quotes manifest should list ≥4 categories');
    return;
  }
  for (const c of qm.categories) {
    requireHas(['public','content','quotes',`${c}.json`], `Missing quotes category: ${c}`);
  }
}

function checkStems(){
  const themes = ['forest','ocean','mountain','autumn','snow'];
  const stems = ['wind','water','leaves','birds','pad'];
  for (const t of themes) {
    for (const s of stems) {
      const p = ['public','assets','audio',t,'stems',`${s}.mp3`];
      if (!has(p)) warns.push(`Stem missing (mp3): ${t}/${s}`);
    }
  }
}

function checkAvatars(){
  const rigs = ['healing','journey'];
  const variants = ['variant-01','variant-02'];
  const formats = [['webm','webm'],['mp4','mp4']];
  for (const r of rigs) {
    for (const v of variants) {
      for (const [folder, ext] of formats) {
        const p = ['public','assets','avatars',r,'idle',v,folder,`idle.${ext}`];
        if (!has(p)) warns.push(`Idle missing for ${r} ${v} (${ext})`);
      }
    }
  }
}

function checkFonts(){
  const dir = join('public','assets','fonts','ui');
  if (!fs.existsSync(dir)) { warns.push('UI fonts folder missing'); return; }
  const woff2 = glob(path.join('public','assets','fonts','ui'), '.woff2');
  if (woff2.length === 0) warns.push('No .woff2 in fonts/ui');
}

function main(){
  checkDevotionals();
  checkQuotes();
  checkStems();
  checkAvatars();
  checkFonts();

  const report = { errors, warns, timestamp: new Date().toISOString() };
  const outDir = join('scripts','qa','reports');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `final-sweep-${Date.now()}.json`);
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));

  console.log('\nAFW Final Sweep — Summary');
  console.log('Errors :', errors.length);
  console.log('Warnings:', warns.length);
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach(e=>console.log(' -', e));
    process.exitCode = 1;
  }
  if (warns.length) {
    console.log('\nWarnings:');
    warns.forEach(w=>console.log(' -', w));
  }
  console.log('\nReport:', outFile);
}

main();
