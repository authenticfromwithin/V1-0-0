AFW Vercel Drop‑In (fixed headers)
==================================

What this is
------------
Minimal config for deploying your Vite app on Vercel without touching your app code.

What's inside
-------------
- vercel.json
  - Uses @vercel/static-build
  - Build: `npm run build`
  - Output: `dist`
  - Routes: SPA fallback (works for /admin, /panel, etc.)
  - Headers: long‑cache on /assets/* (no tricky regex)
- .vercelignore
- This README

How to use (Windows PowerShell)
-------------------------------
1) Place this ZIP in your project root (same folder as package.json).
2) Unzip over the project:
   Expand-Archive -Path .\vercel-drop-in-fixed.zip -DestinationPath . -Force

3) (Optional) Commit the files:
   git add vercel.json .vercelignore README-DROP-IN.txt
   git commit -m "chore: add Vercel drop-in (fixed)"
   git push

Deploy via GitHub (recommended)
-------------------------------
- In Vercel: Add New Project -> pick your Git repo.
- Framework Preset: Vite (or leave Auto)
- Build Command: npm run build
- Output Directory: dist
- Deploy

Deploy via CLI (from project root)
----------------------------------
npm ci
npm run build
vercel build
vercel deploy --prebuilt --prod

If you saw the previous error:
------------------------------
Error: Header at index 0 has invalid `source` pattern "..."
This is fixed by simplifying the header pattern to `/assets/(.*)`.

Blank page troubleshooting
--------------------------
- Ensure `vite.config.*` has `base: '/'` (or unset) for root domain deploys.
- Open devtools Console for any 404s or import errors.
- The SPA fallback in vercel.json will route unknown paths to /index.html.

Notes about media (Git LFS)
---------------------------
Your heavy media is in Git LFS. Deploying via CLI with `--prebuilt` uploads the built `dist/` only, so LFS is not involved. Deploying via Git should also work, but if you ever see LFS fetch issues, prefer the CLI prebuilt flow above.

