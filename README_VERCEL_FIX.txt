Vercel Fix for Vite (AFW)
=========================
Why you saw the error:
- Your existing vercel.json had a "builds" entry pointing at "src" (which only has index.html).
  When "builds" exists, Vercel ignores the Project Settings and expects a builder target of "package.json" or a "build.sh".

What this fix does:
- Sets builds to use @vercel/static-build with src: "package.json" and distDir: "dist".
- Adds SPA rewrites so client routing works.

Apply (in project root):
  PowerShell:
    Copy-Item "$env:USERPROFILE\Downloads\vercel_fix_vite.zip" . -Force
    Expand-Archive -LiteralPath .\vercel_fix_vite.zip -DestinationPath . -Force
    # Sanity check:
    Get-Content .\vercel.json

    # If you use the CLI:
    vercel pull         # fetch env/project settings
    vercel build
    vercel deploy --prod

    # Or via Git push:
    git add vercel.json
    git commit -m "Fix Vercel build: use static-build on package.json + SPA routes"
    git push

Expected:
- No more "Build "src" is "index.html" but expected "package.json" or "build.sh"" error.
- Build command from package.json runs (vite build), output served from /dist with SPA routes.
