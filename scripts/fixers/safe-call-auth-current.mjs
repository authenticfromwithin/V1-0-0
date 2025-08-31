// scripts/fixers/safe-call-auth-current.mjs
// Usage:
//   node scripts/fixers/safe-call-auth-current.mjs
//
// This script rewrites unsafe patterns like:
//   const u = await (typeof auth.current==="function" && auth.current)();
// to a safe version that doesn't accidentally call `false()` when current isn't a function.
//
// After running, commit and deploy:
//   git add src/pages/Home.tsx
//   git commit -m "fix(Home): safe-call auth.current()"
//   git push origin main

import fs from 'node:fs';
import path from 'node:path';

const target = path.resolve('src/pages/Home.tsx');
if (!fs.existsSync(target)) {
  console.error('❌ File not found:', target);
  process.exit(1);
}

let src = fs.readFileSync(target, 'utf8');
const original = src;

// 1) Replace the most common exact pattern (spacing-insensitive)
//    const u = await (typeof auth.current==="function" && auth.current)();
src = src.replace(
  /const\s+u\s*=\s*await\s*\(\s*typeof\s+auth\.current\s*===\s*["']function["']\s*&&\s*auth\.current\s*\)\s*\(\s*\)\s*;/g,
  "const cur = auth?.current; const u = typeof cur === 'function' ? await cur() : null;"
);

// 2) Handle variants with single quotes or extra spaces
src = src.replace(
  /const\s+u\s*=\s*await\s*\(\s*typeof\s+auth\.current\s*===\s*(['"])function\1\s*&&\s*auth\.current\s*\)\s*\(\s*\)\s*;/g,
  "const cur = auth?.current; const u = typeof cur === 'function' ? await cur() : null;"
);

// 3) Super-fallback: rewrite inside the `useEffect` IIFE if needed
//    This catches lines like: (async () => { const u = await (typeof auth.current==="function" && auth.current)(); ... })()
src = src.replace(
  /await\s*\(\s*typeof\s+auth\.current\s*===\s*(['"])function\1\s*&&\s*auth\.current\s*\)\s*\(\s*\)/g,
  "(() => { const cur = auth?.current; return typeof cur === 'function' ? cur() : null; })()"
);

if (src === original) {
  console.log('ℹ️  No matching unsafe pattern found in Home.tsx (nothing changed).');
  process.exit(0);
}

fs.writeFileSync(target, src);
console.log('✅ Patched:', target);
