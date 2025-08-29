// scripts/fetch-fonts.mjs — Node 22+
// Fetches Inter Variable (UI) directly from rsms/inter and copies variable Noto fonts from Fontsource packages.
// Usage (from project root):
//   node scripts/fetch-fonts.mjs
// Requires internet access. Creates /public/assets/fonts/{ui,latin,greek,hebrew}
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import child_process from 'node:child_process';

const root = process.cwd();
const outUi = path.join(root, 'public/assets/fonts/ui');
const outLatin = path.join(root, 'public/assets/fonts/latin');
const outGreek = path.join(root, 'public/assets/fonts/greek');
const outHebrew = path.join(root, 'public/assets/fonts/hebrew');
[outUi, outLatin, outGreek, outHebrew].forEach(p=>fs.mkdirSync(p, { recursive: true }));

async function fetchTo(url, dest){
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buff = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buff);
  console.log('✓', path.relative(root, dest));
}

// 1) Inter Variable from rsms/inter (official)
const interNormal = 'https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/InterVariable.woff2';
const interItalic = 'https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/InterVariable-Italic.woff2';
await fetchTo(interNormal, path.join(outUi, 'InterVariable.woff2'));
await fetchTo(interItalic, path.join(outUi, 'InterVariable-Italic.woff2'));

// 2) Noto variable fonts via Fontsource (official OS packages)
const pkgs = ['@fontsource-variable/noto-serif', '@fontsource-variable/noto-sans', '@fontsource-variable/noto-sans-hebrew'];
console.log('Installing Fontsource packages if missing…');
child_process.execSync(`npm i --no-audit --no-fund --no-save ${pkgs.join(' ')}`, { stdio:'inherit' });

// Find files
function findFile(pkg, contains){
  const base = path.dirname(fileURLToPath(import.meta.url));
  const modPath = path.dirname(require.resolve(pkg + '/package.json', { paths:[root, base] }));
  const filesDir = path.join(modPath, 'files');
  const files = fs.readdirSync(filesDir);
  const match = files.find(f => f.includes(contains) && f.endsWith('.woff2'));
  if (!match) throw new Error(`Could not find ${contains} in ${pkg}`);
  return path.join(filesDir, match);
}

// Copy latin serif
fs.copyFileSync(findFile('@fontsource-variable/noto-serif', 'latin-wght-normal'), path.join(outLatin, 'NotoSerif-Variable.woff2'));
// Copy greek subset from Noto Sans variable
fs.copyFileSync(findFile('@fontsource-variable/noto-sans', 'greek-wght-normal'), path.join(outGreek, 'NotoSansGreek-Variable.woff2'));
// Copy hebrew
fs.copyFileSync(findFile('@fontsource-variable/noto-sans-hebrew', 'wght-normal'), path.join(outHebrew, 'NotoSansHebrew-Variable.woff2'));

console.log('All fonts fetched. Link is defined in public/fonts.css');