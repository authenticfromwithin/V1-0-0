import { promises as fs } from 'node:fs';
import path from 'node:path';

const [,, category, text, author] = process.argv;
if (!category || !text){ console.error('Usage: node scripts/admin/quotes-add.mjs <category> "Quote text" "Author(optional)"'); process.exit(1); }

const dir = path.join('public','content','quotes');
const file = path.join(dir, `${category}.json`);
await fs.mkdir(dir, { recursive: true });
let arr = [];
try { arr = JSON.parse(await fs.readFile(file, 'utf8')); if (!Array.isArray(arr)) arr = []; } catch {}
arr.push({ text, author });
await fs.writeFile(file, JSON.stringify(arr, null, 2), 'utf8');
console.log('Updated', file, 'items:', arr.length);
