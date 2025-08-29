#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const base = path.join(root, 'public', 'content', 'quotes');
function collect(){
  const out = [];
  if (!fs.existsSync(base)) return out;
  for (const theme of fs.readdirSync(base)){
    const p = path.join(base, theme);
    if (!fs.statSync(p).isDirectory()) continue;
    for (const f of fs.readdirSync(p)){
      if (f.endsWith('.json')){
        const arr = JSON.parse(fs.readFileSync(path.join(p,f),'utf8'));
        for (const q of arr){
          out.push({ id: q.id, text: q.text, author: q.author||'', theme });
        }
      }
    }
  }
  return out;
}
const all = collect();
await fsp.writeFile(path.join(root,'public','content','quotes.manifest.json'), JSON.stringify(all,null,2));
console.log(`Wrote ${all.length} quotes to manifest.`);
