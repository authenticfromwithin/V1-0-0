import { promises as fs } from 'node:fs';
import path from 'node:path';

const THEMES = ['forest','ocean','mountain','autumn','snow'];
const STEMS = ['wind','water','leaves','birds','pad'];
const HEALING = ['idle','walk','stretch','drink','sit_pray','pick_eat_fruit'];
const JOURNEY = ['idle','walk','pray','reflect','read_devotional','kneel'];

const report = { missing: [], warnings: [], ok: true };

async function exists(p){ try { await fs.access(p); return true; } catch { return false; } }
function miss(p){ report.missing.push(p); report.ok = false; }

for (const t of THEMES){
  for (const f of ['back.webp','mid.webp','front.webp']){
    const p = path.join('public','assets','scenes', t, 'plates', f);
    if (!await exists(p)) miss(p);
  }
  for (const s of STEMS){
    const p = path.join('public','assets','audio', t, 'stems', `${s}.mp3`);
    if (!await exists(p)) miss(p);
  }
}

for (const s of HEALING){
  for (const ext of [['webm','webm'], ['mp4','mp4']]){
    const p = path.join('public','assets','avatars','healing', s, ext[0], `${s}.${ext[1]}`);
    if (!await exists(p)) report.warnings.push('Missing healing clip: '+p);
  }
}

for (const s of JOURNEY){
  for (const ext of [['webm','webm'], ['mp4','mp4']]){
    const p = path.join('public','assets','avatars','journey', s, ext[0], `${s}.${ext[1]}`);
    if (!await exists(p)) report.warnings.push('Missing journey clip: '+p);
  }
}

const mfD = path.join('public','content','devotionals.manifest.json');
if (!await exists(mfD)) miss(mfD);

const mfQ = path.join('public','content','quotes.manifest.json');
if (!await exists(mfQ)) miss(mfQ);

await fs.mkdir(path.join('scripts','qa'), { recursive: true });
await fs.writeFile(path.join('scripts','qa','last-report.json'), JSON.stringify(report, null, 2), 'utf8');

if (!report.ok){
  console.error('[AFW QA] Missing critical assets:');
  for (const p of report.missing) console.error('  -', p);
  process.exit(1);
}
if (report.warnings.length){
  console.warn('[AFW QA] Warnings:');
  for (const p of report.warnings) console.warn('  -', p);
}
console.log('[AFW QA] OK');
