#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const pub = p => path.join(root, 'public', p);
function readJSON(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch(e){ return null; } }
const report = { ok: true, stats:{ devotionals:{count:0, byMonth:{}}, quotes:{count:0} }, missing:[], errors:[] };
const devoManifestPath = pub('content/devotionals.manifest.json');
const devoManifest = readJSON(devoManifestPath) || [];
for (const d of devoManifest){
  if (!d.id || !d.date){ report.errors.push(`Devo missing id/date: ${JSON.stringify(d)}`); continue; }
  const mm = d.date.slice(0,7);
  report.stats.devotionals.byMonth[mm] = (report.stats.devotionals.byMonth[mm]||0)+1;
  const file = pub(`content/devotionals/${mm}/devotional-${d.date}.json`);
  if (!fs.existsSync(file)) report.missing.push(`Missing devotional file: ${file}`);
}
report.stats.devotionals.count = devoManifest.length;
const quotesManifestPath = pub('content/quotes.manifest.json');
const quotesManifest = readJSON(quotesManifestPath) || [];
report.stats.quotes.count = quotesManifest.length;
const rigs = ['healing','journey'];
const states = { healing: ['idle','walk','stretch','drink','sit_pray','pick_eat_fruit'], journey: ['idle','walk','stretch','drink','sit_pray','pick_eat_fruit'] };
const variants = ['variant-01','variant-02'];
const exts = [{dir:'webm', file:'.webm'}, {dir:'mp4', file:'.mp4'}];
for (const rig of rigs){
  for (const st of states[rig]){
    for (const v of variants){
      for (const ext of exts){
        const p = pub(`assets/avatars/${rig}/${st}/${v}/${ext.dir}/${st}${ext.file}`);
        if (!fs.existsSync(p)) report.missing.push(`Missing clip: ${p}`);
      }
    }
  }
}
const themes = ['forest','ocean','mountain','autumn','snow'];
const stems = ['wind','water','leaves','birds','pad'];
for (const t of themes){
  for (const s of stems){
    const p = pub(`assets/audio/${t}/stems/${s}.mp3`);
    if (!fs.existsSync(p)) report.missing.push(`Missing stem: ${p}`);
  }
}
report.ok = report.errors.length === 0 && report.missing.length === 0;
await fsp.writeFile(path.join(root,'scripts/content/last-report.json'), JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if (!report.ok) process.exitCode = 1;
