// scripts/copy-public-assets.mjs
import { cp, access, mkdir } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const BUILD = path.join(ROOT, 'build');

async function exists(p) {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
}

async function copyDir(srcName) {
  const src = path.join(ROOT, srcName);
  const dst = path.join(BUILD, srcName);
  if (!(await exists(src))) {
    console.log(`[skip] ${srcName}/ not found at repo root`);
    return;
  }
  await mkdir(dst, { recursive: true });
  await cp(src, dst, { recursive: true, force: true });
  console.log(`[ok] copied ${srcName}/ → build/${srcName}/`);
}

(async () => {
  console.log('=== Postbuild: copy root static folders into build ===');
  await copyDir('assets');
  await copyDir('content');
  console.log('=== Done ===');
})();
