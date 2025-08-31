// scripts/fixers/guard-ref-current.mjs
// Rewrites any `X.current(` → `(typeof X.current==="function" && X.current)(` in src/pages/Home.tsx

import fs from "node:fs";
import path from "node:path";

const file = path.resolve("src/pages/Home.tsx");

if (!fs.existsSync(file)) {
  console.error("ERROR: src/pages/Home.tsx not found. Adjust the script path if your file is elsewhere.");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const before = code;

// Replace occurrences like foo.current( ... ) with a guarded callable check.
// Note: this ONLY guards direct identifier refs like foo.current(...).
// If you have something like obj.foo.current(...), ping me and I'll extend the fixer.
code = code.replace(/([A-Za-z_$][\w$]*)\.current\s*\(/g, '(typeof $1.current==="function" && $1.current)(');

if (code !== before) {
  fs.writeFileSync(file, code);
  console.log("Patched:", file);
} else {
  console.log("No `.current(` calls found in", file);
}
