import fs from 'fs';
import path from 'path';

const cfg = JSON.parse(fs.readFileSync('scripts/verify-clips.json', 'utf-8'));
const missing = [];

function check(file){ return fs.existsSync(file); }

for (const s of cfg.healing){
  const base = `public/assets/avatars/healing/${s}`;
  const combos = [
    `${base}/webm/${s}.webm`,
    `${base}/mp4/${s}.mp4`,
    `${base}/set-a/webm/${s}.webm`,
    `${base}/set-a/mp4/${s}.mp4`,
    `${base}/set-b/webm/${s}.webm`,
    `${base}/set-b/mp4/${s}.mp4`
  ];
  for (const f of combos){ if (!check(f)) missing.push(f); }
}

for (const s of cfg.journey){
  const base = `public/assets/avatars/journey/${s}`;
  const combos = [
    `${base}/webm/${s}.webm`,
    `${base}/mp4/${s}.mp4`
  ];
  for (const f of combos){ if (!check(f)) missing.push(f); }
}

if (missing.length){
  console.log('Missing files:');
  for (const m of missing) console.log('  -', m);
  process.exitCode = 1;
} else {
  console.log('All expected clips present. ✅');
}
