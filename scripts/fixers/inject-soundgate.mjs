/**
 * Injects SoundGate component and fire.css into src/pages/Home.tsx
 * - Adds: import SoundGate from '@/components/System/SoundGate'
 * - Adds: import '../styles/fire.css'
 * - Inserts <SoundGate /> and a <div className="afw-fire-bg" />
 */
import fs from 'node:fs';
import path from 'node:path';

const homePath = path.resolve('src/pages/Home.tsx');
if (!fs.existsSync(homePath)) {
  console.error('Home.tsx not found at src/pages/Home.tsx');
  process.exit(1);
}
let src = fs.readFileSync(homePath, 'utf8');

if (!src.includes("import SoundGate")) {
  // Add after first import block
  src = src.replace(/(import [^;]+;\s*)+/, (m) => m + "\nimport SoundGate from '@/components/System/SoundGate';\nimport '../styles/fire.css';\n");
}

if (!src.includes('<SoundGate')) {
  // Try to inject right after the opening of the top-level wrapper <div ...>
  src = src.replace(/return \(\s*<div[^>]*>/, (m) => m + "\n      <SoundGate />\n      <div className=\"afw-fire-bg\" aria-hidden=\"true\" />");
}

fs.writeFileSync(homePath, src, 'utf8');
console.log('Patched:', homePath);
