STEP 03 — TypeScript Paths (Merge-Safe)
======================================
Files:
- tsconfig.paths.merge-example.json (reference)
- paths.patch.md (copy the snippet into your tsconfig.json)

Why:
- Ensures IDE + TS understand the same aliases as Vite (`@/*`, `components/*`, `styles/*`, `logic/*`).
- Prevents brittle relative imports and keeps build stable.
