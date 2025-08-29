#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const base = path.join(root, 'public', 'content', 'devotionals');
function list(dir){
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const y of fs.readdirSync(dir)){
    const p = path.join(dir, y);
    if (fs.statSync(p).isDirectory()){
      for (const f of fs.readdirSync(p)){
        if (f.startsWith('devotional-') && f.endsWith('.json')){
          const date = f.slice('devotional-'.length, -'.json'.length);
          const id = date;
          const j = JSON.parse(fs.readFileSync(path.join(p,f),'utf8'));
          out.push({ id, date, title: j.title || `Devotional ${date}`, passage: j.passage || '' });
        }
      }
    }
  }
  return out.sort((a,b)=> a.date.localeCompare(b.date));
}
const items = list(base);
await fsp.writeFile(path.join(root,'public','content','devotionals.manifest.json'), JSON.stringify(items,null,2));
console.log(`Wrote ${items.length} devotionals to manifest.`);
