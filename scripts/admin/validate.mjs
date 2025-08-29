import { promises as fs } from 'node:fs';
import path from 'node:path';

let ok = true;
function err(x){ console.error('✗', x); ok = false; }
function info(x){ console.log('•', x); }

async function exists(p){ try { await fs.access(p); return true; } catch { return false; } }

async function validateDevotionals(){
  const mf = path.join('public','content','devotionals.manifest.json');
  if (!await exists(mf)){ err('devotionals.manifest.json missing'); return; }
  const items = JSON.parse(await fs.readFile(mf,'utf8'));
  if (!Array.isArray(items)) { err('devotionals.manifest.json must be an array'); return; }
  for (const d of items){
    const id = d.id || d.date;
    if (!id) { err('devotional entry missing id/date'); continue; }
    const month = id.slice(0,7);
    const f = path.join('public','content','devotionals', month, `devotional-${id}.json`);
    if (!await exists(f)) err('Missing devotional file: '+f);
  }
  info('Devotionals validated');
}

async function validateQuotes(){
  const mf = path.join('public','content','quotes.manifest.json');
  if (!await exists(mf)){ err('quotes.manifest.json missing'); return; }
  const data = JSON.parse(await fs.readFile(mf,'utf8'));
  const cats = Array.isArray(data) ? [] : (data.categories || []);
  for (const c of cats){
    const f = path.join('public','content','quotes', c+'.json');
    if (!await exists(f)) err('Missing quotes category file: '+f);
  }
  info('Quotes validated (structure)');
}

await validateDevotionals();
await validateQuotes();
if (!ok) process.exit(1);
console.log('OK');
