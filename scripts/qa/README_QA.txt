AFW — Pack 8: Final QA Pack

Included:
  scripts/qa/predeploy.mjs         → deep checks (scenes, stems, avatars, manifests, fonts)
  scripts/qa/check-assets.mjs      → flags heavy/leftover formats & large files
  scripts/qa/generate-sitemap.mjs  → writes public/sitemap.txt (SPA routes)
  scripts/qa/run-all.bat           → one-click on Windows
  scripts/qa/run-all.sh            → one-click on macOS/Linux

How to run (Windows):
  double-click scripts\qa\run-all.bat

How to run (CLI):
  node scripts/qa/predeploy.mjs
  node scripts/qa/check-assets.mjs
  node scripts/qa/generate-sitemap.mjs

Outputs:
  scripts/qa/last-predeploy.json
  scripts/qa/last-asset-lint.json
  public/sitemap.txt

If 'predeploy' prints any [FAIL], address those before pushing to GitHub/Vercel.
Warnings are advisory; you may keep them if intentional.
