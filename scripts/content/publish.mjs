import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUB = path.join(ROOT, 'public', 'content');

const out = { updated: [], warnings: [] };

async function exists(p){ try { await fs.access(p); return true; } catch { return false; } }

function ymd(d){ const x = new Date(d); return x.toISOString().slice(0,10); }

async function updateDevotionals(){
  const base = path.join(PUB, 'devotionals');
  if (!await exists(base)) { out.warnings.push('No devotionals/ folder found'); return; }
  const months = await fs.readdir(base);
  const items = [];
  for (const m of months){
    const dir = path.join(base, m);
    const stat = await fs.stat(dir).catch(()=>null);
    if (!stat || !stat.isDirectory()) continue;
    const files = await fs.readdir(dir);
    for (const f of files){
      if (!f.startsWith('devotional-') || !f.endsWith('.json')) continue;
      const id = f.replace('devotional-', '').replace('.json','');
      const full = path.join(dir, f);
      try {
        const data = JSON.parse(await fs.readFile(full, 'utf8'));
        const title = data.title || id;
        const date = data.date || id;
        items.push({ id, title, date, passage: data.passage || '' });
      } catch {
        out.warnings.push('Bad JSON: ' + full);
      }
    }
  }
  items.sort((a,b)=> new Date(b.date) - new Date(a.date));
  const mfPath = path.join(PUB, 'devotionals.manifest.json');
  await fs.writeFile(mfPath, JSON.stringify(items, null, 2), 'utf8');
  out.updated.push('devotionals.manifest.json ('+items.length+' items)');
}

async function validateQuotes(){
  const mfPath = path.join(PUB, 'quotes.manifest.json');
  if (!await exists(mfPath)) { out.warnings.push('quotes.manifest.json missing'); return { items:[] }; }
  const mf = JSON.parse(await fs.readFile(mfPath, 'utf8'));
  if (Array.isArray(mf)) return { items: mf, categories: [] };
  const cats = mf.categories || [];
  for (const c of cats){
    const p = path.join(PUB, 'quotes', c + '.json');
    if (!await exists(p)) out.warnings.push('Missing quotes category: ' + c + '.json');
  }
  return mf;
}

async function mergeQuotes(){
  const mf = await validateQuotes();
  const cats = mf.categories || [];
  const merged = mf.items ? [...mf.items] : [];
  for (const c of cats){
    const p = path.join(PUB, 'quotes', c + '.json');
    try {
      const arr = JSON.parse(await fs.readFile(p, 'utf8'));
      for (const q of arr) merged.push(q);
    } catch {}
  }
  const dedup = [];
  const seen = new Set();
  for (const q of merged){
    const key = (q.text || '') + '|' + (q.author || '');
    if (!seen.has(key)){ seen.add(key); dedup.push(q); }
  }
  await fs.writeFile(path.join(PUB, 'quotes.manifest.json'), JSON.stringify({ items: dedup }, null, 2), 'utf8');
  out.updated.push('quotes.manifest.json ('+dedup.length+' items)');
}

async function main(){
  const args = process.argv.slice(2);
  if (args.includes('--devotionals')) await updateDevotionals();
  if (args.includes('--quotes-validate')) await validateQuotes();
  if (args.includes('--quotes-merge')) await mergeQuotes();
  await fs.writeFile(path.join(ROOT, 'scripts', 'content', 'last-run.json'), JSON.stringify(out, null, 2), 'utf8');
  console.log('[AFW content] done'); 
  if (out.updated.length) console.log(' updated:', out.updated);
  if (out.warnings.length) console.log(' warnings:', out.warnings);
}

main().catch(err => { console.error(err); process.exit(1); });
