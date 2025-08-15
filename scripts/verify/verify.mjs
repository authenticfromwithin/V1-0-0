#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import url from 'url';

const cwd = process.cwd();
const outDir = path.join('scripts','verify');
const reportPath = path.join(outDir,'last-report.json');

/** Helpers */
function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }
function readJSON(p){
  try { return JSON.parse(fs.readFileSync(p,'utf8')); }
  catch(e){ return { __error: e.message }; }
}
function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function rel(p){ return p.replace(cwd+path.sep, ''); }

const checks = [];
function check(label, fn){
  try {
    const ok = !!fn();
    checks.push({ label, ok });
  } catch (e) {
    checks.push({ label, ok:false, error: String(e.message || e) });
  }
}

function summary(){
  const ok = checks.filter(c => c.ok).length;
  const fail = checks.length - ok;
  return { ok, fail, total: checks.length };
}

function log(msg){ console.log(msg); }

/** --- Paths --- */
const P = {
  public: path.join(cwd,'public'),
  manifests: path.join(cwd,'public','assets','manifests'),
  scenes: path.join(cwd,'public','assets','scenes'),
  avatars: path.join(cwd,'public','assets','avatars'),
  audio: path.join(cwd,'public','assets','audio'),
  content: path.join(cwd,'public','content'),
  vercel: path.join(cwd,'vercel.json'),
  indexHtml: path.join(cwd,'public','index.html'),
  fourOhFour: path.join(cwd,'public','404.html')
};

/** --- File existence --- */
check('public exists', () => exists(P.public));
check('index.html exists', () => exists(P.indexHtml));
check('404.html exists', () => exists(P.fourOhFour));
check('vercel.json exists', () => exists(P.vercel));

check('assets.manifest.json exists', () => exists(path.join(P.manifests,'assets.manifest.json')));
check('avatars.manifest.json exists', () => exists(path.join(P.manifests,'avatars.manifest.json')));
check('audio.manifest.json exists', () => exists(path.join(P.manifests,'audio.manifest.json')));
check('narration.manifest.json exists', () => exists(path.join(P.manifests,'narration.manifest.json')));

check('quotes.manifest.json exists', () => exists(path.join(P.content,'quotes.manifest.json')));
check('devotionals.manifest.json exists', () => exists(path.join(P.content,'devotionals.manifest.json')));

/** --- JSON shape checks --- */
const assets = readJSON(path.join(P.manifests,'assets.manifest.json'));
const avatars = readJSON(path.join(P.manifests,'avatars.manifest.json'));
const audio = readJSON(path.join(P.manifests,'audio.manifest.json'));
const narration = readJSON(path.join(P.manifests,'narration.manifest.json'));
const quotes = readJSON(path.join(P.content,'quotes.manifest.json'));
const devos = readJSON(path.join(P.content,'devotionals.manifest.json'));

const THEMES = ['forest','ocean','mountain','autumn','snow'];

check('assets.manifest has all scenes', () => THEMES.every(t => assets?.scenes?.[t]));
check('avatars.manifest has healing + journey', () => avatars?.avatars?.healing && avatars?.avatars?.journey);
check('audio.manifest has all ambience themes', () => THEMES.every(t => audio?.ambience?.[t]));
check('narration.manifest has tracks', () => Array.isArray(narration?.tracks) && narration.tracks.length >= 1);
check('quotes.manifest has expected categories', () => ['identity','faith','healing','hope'].every(c => (quotes?.categories||[]).includes(c)));
check('devotionals.manifest has 2025-08 month', () => devos?.files?.['2025-08'] && Array.isArray(devos.files['2025-08']));

/** --- Directory checks (spot) --- */
function dirTriplet(root, sub){
  return ['plates','depth','atmos'].every(d => exists(path.join(root, sub, d)));
}
check('scenes/forest has plates/depth/atmos', () => dirTriplet(P.scenes,'forest'));
check('scenes/ocean has plates/depth/atmos', () => dirTriplet(P.scenes,'ocean'));
check('scenes/mountain has plates/depth/atmos', () => dirTriplet(P.scenes,'mountain'));
check('scenes/autumn has plates/depth/atmos', () => dirTriplet(P.scenes,'autumn'));
check('scenes/snow has plates/depth/atmos', () => dirTriplet(P.scenes,'snow'));

function avatarDirs(kind, pose){
  return ['webm','hevc','stills'].every(codec => exists(path.join(P.avatars, kind, pose, codec)));
}
check('avatars/healing idle has codec dirs', () => avatarDirs('healing','idle'));
check('avatars/journey idle has codec dirs', () => avatarDirs('journey','idle'));

function audioDir(theme){
  return exists(path.join(P.audio, theme, 'stems'));
}
THEMES.forEach(t => check(`audio/${t}/stems dir exists`, () => audioDir(t)));

/** --- vercel.json sanity (optional SPA rewrite) --- */
const vercel = readJSON(P.vercel);
check('vercel.json has rewrites or cleanUrls', () => 
  (Array.isArray(vercel.rewrites) && vercel.rewrites.length >= 0) || (vercel.cleanUrls !== undefined)
);

/** --- Write report + exit code --- */
const report = {
  when: new Date().toISOString(),
  cwd,
  results: checks,
  summary: summary()
};
ensureDir(outDir);
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
const s = summary();
const banner = `AFW Verify — ${s.ok}/${s.total} PASS, ${s.fail} FAIL`;
console.log('\n' + '='.repeat(banner.length));
console.log(banner);
console.log('Report:', rel(reportPath));
console.log('Run path:', cwd);
console.log('='.repeat(banner.length) + '\n');
process.exit(s.fail ? 1 : 0);
