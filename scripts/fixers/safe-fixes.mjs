// scripts/fixers/safe-fixes.mjs
// Purpose: apply *surgical* code-safety patches without changing visuals or design.
// - Guard `.map` on possibly-undefined arrays in Parallax.tsx
// - Guard `auth.current()` in Home.tsx
// - Normalize ErrorBoundary import casing in main.tsx
//
// Usage:
//   node scripts/fixers/safe-fixes.mjs
//
// It will print which files were patched. If a file is missing, it skips quietly.

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

/** Helper to patch a file by find/replace array of [regex, replacement] */
function patchFile(relPath, edits) {
  const abs = path.join(repoRoot, relPath);
  if (!fs.existsSync(abs)) return { ok: false, reason: 'missing' };
  let src = fs.readFileSync(abs, 'utf8');
  let orig = src;
  for (const [re, repl] of edits) {
    src = src.replace(re, repl);
  }
  if (src !== orig) {
    fs.writeFileSync(abs, src);
    return { ok: true, changed: true };
  }
  return { ok: true, changed: false };
}

const results = [];

// 1) Parallax.tsx: make `.map` safe for 'layers' or 'props.layers'
{
  const rel = 'src/components/SceneParallax/Parallax.tsx';
  if (fs.existsSync(path.join(repoRoot, rel))) {
    let src = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
    let changed = false;
    if (!/AFW_forceArray/.test(src)) {
      src = src.replace(/(^|\n)/, 
`$1/* AFW safety shim: do not remove. Ensures .map() never runs on undefined */
const AFW_forceArray = (v:any) => Array.isArray(v) ? v : [];
`);
      changed = true;
    }
    const pairs = [
      [/\blayers\.map\(/g, 'AFW_forceArray(layers).map('],
      [/\bprops\.layers\.map\(/g, 'AFW_forceArray(props.layers).map('],
    ];
    let src2 = src;
    for (const [re, rep] of pairs) src2 = src2.replace(re, rep);
    if (src2 !== src) changed = true;
    if (changed) {
      fs.writeFileSync(path.join(repoRoot, rel), src2);
      results.push({ file: rel, patched: true });
    } else {
      results.push({ file: rel, patched: false });
    }
  } else {
    results.push({ file: 'src/components/SceneParallax/Parallax.tsx', skipped: 'not found' });
  }
}

// 2) Home.tsx: guard auth.current() calls, without changing design
{
  const rel = 'src/pages/Home.tsx';
  const edits = [
    // Replace direct auth.current() with a safe-call expression
    [/\bauth\.current\(\)/g, "(typeof auth?.current==='function' ? auth.current() : Promise.resolve(null))"],
    // Optional: avoid calling ref.current as a function (common anti-pattern)
    // Replace occurrences of `.current()` with value access when likely a ref
    [/\.current\(\)/g, '.current' ],
  ];
  const res = patchFile(rel, edits);
  if (res.ok) results.push({ file: rel, patched: !!res.changed }); else results.push({ file: rel, skipped: res.reason });
}

// 3) main.tsx: normalize ErrorBoundary import casing only (no visual change)
{
  const rel = 'src/main.tsx';
  if (fs.existsSync(path.join(repoRoot, rel))) {
    let src = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
    let changed = false;
    // Fix wrong-cased path "./components/system/ErrorBoundary" -> "@/components/System/ErrorBoundary"
    src = src.replace(/["']\.\/components\/system\/ErrorBoundary["']/g, "'@/components/System/ErrorBoundary'");
    // Also normalize to alias if using relative variant with correct casing
    src = src.replace(/["']\.\/components\/System\/ErrorBoundary["']/g, "'@/components/System/ErrorBoundary'");
    // If the import doesn't exist but file does in repo, add a guarded import that won't crash if unused
    if (!/ErrorBoundary/.test(src)) {
      // Do nothing unless the user wants it; we keep minimal surface
    }
    const after = src;
    if (after !== src) changed = true;
    if (changed) fs.writeFileSync(path.join(repoRoot, rel), after);
    results.push({ file: rel, patched: changed });
  } else {
    results.push({ file: 'src/main.tsx', skipped: 'not found' });
  }
}

console.log(JSON.stringify({ results }, null, 2));