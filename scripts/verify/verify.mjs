// scripts/verify/verify.mjs — Node 22+
// Verifies presence and shape of assets & content for AFW (offline).
// Usage: node scripts/verify/verify.mjs
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUTDIR = path.join(ROOT, 'scripts', 'verify');
const REPORT = path.join(OUTDIR, 'last-report.json');

const THEMES = ['forest','ocean','mountain','autumn','snow'];
const STEMS = ['wind','water','leaves','birds','pad'];

const Healing = {
  rig: 'healing',
  states: ['idle','walk','stretch','drink','sit_pray','pick_eat_fruit'],
};
const Journey = {
  rig: 'journey',
  states: ['idle','walk','pray','reflect','read_devotional','kneel'],
};

function exists(p){ try { fssync.accessSync(p); return true; } catch { return false; } }
async function readJson(p){ try { return JSON.parse(await fs.readFile(p, 'utf8')); } catch { return null; } }
function findMonthlyDevoDir(root){ // returns array of dirs like YYYY-MM
  const p = path.join(root, 'public', 'content', 'devotionals');
  if (!exists(p)) return [];
  return fssync.readdirSync(p, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{4}-\d{2}$/.test(d.name))
    .map(d => d.name);
}
function listDevoIdsFromManifest(root){
  const mf = path.join(root, 'public', 'content', 'devotionals.manifest.json');
  if (!exists(mf)) return [];
  try { const data = JSON.parse(fssync.readFileSync(mf,'utf8')); return Array.isArray(data) ? data.map(x=>x.id) : (data.items||[]).map(x=>x.id); } catch { return []; }
}

async function run(){
  const summary = {
    time: new Date().toISOString(),
    scenes: {},
    stems: {},
    avatars: {},
    fonts: {},
    content: { devotionals: { manifest:false, monthlyDirs:[], byId:{} }, quotes:{ manifest:false }, guide:{ manifest:false, sections:[] } },
    narration: {},
    counts: { errors:0, warnings:0, infos:0 }
  };

  // Scenes plates
  for (const t of ['forest','ocean','mountain','autumn','snow']){
    const plateDir = path.join(ROOT,'public','assets','scenes',t,'plates');
    const ok = ['back.webp','mid.webp','front.webp'].every(f => exists(path.join(plateDir,f)));
    summary.scenes[t] = { dir: rel(plateDir), ok };
    if (!ok) summary.counts.errors++;
  }

  // Stems
  for (const t of ['forest','ocean','mountain','autumn','snow']){
    const sd = path.join(ROOT,'public','assets','audio',t,'stems');
    const missing = ['wind','water','leaves','birds','pad'].filter(s => !exists(path.join(sd, `${s}.mp3`)));
    summary.stems[t] = { dir: rel(sd), missing };
    if (missing.length) summary.counts.errors += missing.length;
  }

  // Avatars default (both formats)
  for (const rig of [ {rig:'healing', states:['idle','walk','stretch','drink','sit_pray','pick_eat_fruit']},
                      {rig:'journey', states:['idle','walk','pray','reflect','read_devotional','kneel']} ]){
    const rigName = rig.rig;
    const states = rig.states;
    const perState = {};
    for (const st of states){
      const mp4 = path.join(ROOT,'public','assets','avatars',rigName,st,'mp4',`${st}.mp4`);
      const webm = path.join(ROOT,'public','assets','avatars',rigName,st,'webm',`${st}.webm`);
      perState[st] = { mp4: exists(mp4), webm: exists(webm) };
      if (!perState[st].mp4 && !perState[st].webm) summary.counts.errors++;
      else if (!perState[st].mp4 || !perState[st].webm) summary.counts.warnings++;
    }
    summary.avatars[rigName] = { states: perState, variantsHint: 'Optional: archetype-a/b + variant-01/02 folders' };
  }

  // Fonts presence (not required but recommended)
  const fonts = {
    ui: exists(path.join(ROOT,'public','assets','fonts','ui','InterVariable.woff2')),
    serif: exists(path.join(ROOT,'public','assets','fonts','latin','NotoSerif-Variable.woff2')),
    greek: exists(path.join(ROOT,'public','assets','fonts','greek','NotoSansGreek-Variable.woff2')),
    hebrew: exists(path.join(ROOT,'public','assets','fonts','hebrew','NotoSansHebrew-Variable.woff2'))
  };
  summary.fonts = fonts;

  // Content: devotionals
  const devoManifest = path.join(ROOT,'public','content','devotionals.manifest.json');
  summary.content.devotionals.manifest = exists(devoManifest);
  const monthlyDirs = findMonthlyDevoDir(ROOT);
  summary.content.devotionals.monthlyDirs = monthlyDirs;
  const ids = listDevoIdsFromManifest(ROOT);
  for (const id of ids){
    const m = /devotional-(\d{4})-(\d{2})-(\d{2})/.exec(id);
    let p = null;
    if (m) p = path.join(ROOT,'public','content','devotionals',`${m[1]}-${m[2]}`,`${id}.json`);
    if (!p || !exists(p)) { summary.content.devotionals.byId[id] = { exists:false, path: p?rel(p):null }; summary.counts.errors++; }
    else {
      const js = await readJson(p);
      const hasText = js && (js.body || js.text || js.title);
      summary.content.devotionals.byId[id] = { exists:true, path: rel(p), hasText: !!hasText };
      if (!hasText) summary.counts.warnings++;
    }
  }

  // Content: quotes
  const quotesManifest = path.join(ROOT,'public','content','quotes.manifest.json');
  summary.content.quotes.manifest = exists(quotesManifest);

  // Content: guide
  const guideManifest = path.join(ROOT,'public','content','guide.manifest.json');
  summary.content.guide.manifest = exists(guideManifest);
  if (exists(guideManifest)) {
    try {
      const g = JSON.parse(fssync.readFileSync(guideManifest,'utf8'));
      const sections = Array.isArray(g) ? g : g.sections;
      if (Array.isArray(sections)) {
        summary.content.guide.sections = sections.map(s => ({
          id: s.id, title: s.title, file: s.file || `/content/guide/sections/${s.id}.md`,
          exists: exists(path.join(ROOT, 'public', (s.file || `/content/guide/sections/${s.id}.md`).replace(/^\//,'')))
        }));
        summary.counts.warnings += summary.content.guide.sections.filter(s=>!s.exists).length;
      }
    } catch {}
  }

  // Narration: for devo IDs
  for (const id of ids){
    const mp3 = path.join(ROOT,'public','narration','tracks',`${id}.mp3`);
    const ogg = path.join(ROOT,'public','narration','tracks',`${id}.ogg`);
    const vtt = path.join(ROOT,'public','narration','captions',`${id}.vtt`);
    const st = { mp3: exists(mp3), ogg: exists(ogg), vtt: exists(vtt) };
    summary.narration[id] = st;
    if (!st.mp3 && !st.ogg) summary.counts.warnings++;
    if (!st.vtt) summary.counts.warnings++;
  }

  await fs.mkdir(OUTDIR, { recursive: true });
  await fs.writeFile(REPORT, JSON.stringify(summary, null, 2));
  printSummary(summary);
}

function rel(p){ return p ? path.relative(ROOT, p).replaceAll('\\','/') : null; }

function printSummary(s){
  const lines = [];
  lines.push('AFW Integrity Report');
  lines.push('====================');
  lines.push(`Time: ${s.time}`);
  lines.push('');
  lines.push('Scenes:');
  for (const [t, info] of Object.entries(s.scenes)){
    lines.push(`  - ${t}: ${info.ok ? 'OK' : 'MISSING plates (back/mid/front)'}`);
  }
  lines.push('Stems:');
  for (const [t, info] of Object.entries(s.stems)){
    const missing = info.missing || [];
    lines.push(`  - ${t}: ${missing.length ? 'MISSING: '+missing.join(', ') : 'OK'}`);
  }
  lines.push('Avatars:');
  for (const [rig, rinfo] of Object.entries(s.avatars)){
    lines.push(`  - ${rig}:`);
    for (const [st, ok] of Object.entries(rinfo.states)){
      lines.push(`      ${st}: mp4=${ok.mp4?'✓':'×'} webm=${ok.webm?'✓':'×'}`);
    }
  }
  lines.push('Content (devotionals):');
  lines.push(`  manifest: ${s.content.devotionals.manifest ? '✓' : '×'}`);
  const missingDevo = Object.entries(s.content.devotionals.byId).filter(([,v]) => !v.exists).map(([k])=>k);
  if (missingDevo.length) lines.push(`  missing JSON: ${missingDevo.join(', ')}`);
  lines.push('Content (quotes): ' + (s.content.quotes.manifest ? 'manifest ✓' : 'manifest ×'));
  lines.push('Content (guide): ' + (s.content.guide.manifest ? 'manifest ✓' : 'manifest ×'));
  lines.push('Narration (by id):');
  const ids = Object.keys(s.narration);
  if (!ids.length) lines.push('  (no ids in manifest)');
  for (const id of ids){
    const n = s.narration[id];
    lines.push(`  - ${id}: mp3=${n.mp3?'✓':'×'} ogg=${n.ogg?'✓':'×'} vtt=${n.vtt?'✓':'×'}`);
  }
  lines.push('');
  lines.push(`Errors: ${s.counts.errors}   Warnings: ${s.counts.warnings}`);
  lines.push('Report saved to scripts/verify/last-report.json');
  console.log(lines.join('\n'));
}

run().catch(err => { console.error(err); process.exitCode = 1; });
