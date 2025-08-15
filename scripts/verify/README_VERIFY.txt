AFW — Local Test Scripts Pack
Generated: 2025-08-14 04:35:59 SAST

What this does
- Verifies your folder tree and all AFW manifests exist and contain the expected keys.
- Checks presence of scene/avatars/audio directories and SPA files (index.html, 404.html, vercel.json).
- Writes a JSON report to scripts/verify/last-report.json and exits non‑zero on failure.

How to run (Windows):
1) Open File Explorer at your project root.
   Example: C:\Users\FAMSA\Documents\AFW-v1.0.0\frontend-project
2) Double‑click: scripts\verify\verify.bat
   or run in Command Prompt:
   node scripts\verify\verify.mjs

How to run (Mac/Linux):
bash scripts/verify/verify.sh

Expected output:
  AFW Verify — 20/20 PASS, 0 FAIL
  Report: scripts/verify/last-report.json

If something fails, open scripts/verify/last-report.json to see the exact check that failed.
