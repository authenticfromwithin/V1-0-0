import { promises as fs } from 'node:fs';
import path from 'node:path';

const [,, dateArg, titleArg, passageArg] = process.argv;
if (!dateArg){ console.error('Usage: node scripts/admin/devo-new.mjs YYYY-MM-DD "Title" "Passage"'); process.exit(1); }
const id = dateArg;
const month = id.slice(0,7);
const obj = { id, title: titleArg || id, date: id, passage: passageArg || '', body: '' };

const dir = path.join('public','content','devotionals', month);
await fs.mkdir(dir, { recursive: true });
const file = path.join(dir, `devotional-${id}.json`);
await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf8');
console.log('Created', file);
