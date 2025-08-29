AFW — Vite + Vercel Fix Pack
============================

Files included (place them in your PROJECT ROOT):
- vercel.json           → SPA rewrites so client routes load index.html
- vite.config.mts       → ESM Vite config + manual path aliases (components, guards, logic, styles)
- src/main.tsx          → Mounts your App component and imports styles/globals.css
- src/styles/globals.css→ Minimal stylesheet to avoid missing import

How to apply (Windows PowerShell):
----------------------------------
1) Unzip into the project root (allow overwrite of the files above).
   Expand-Archive -Path "$env:USERPROFILE\Downloads\afw-vercel-vite-fixes.zip" -DestinationPath . -Force

2) Ensure your index.html contains: <div id="root"></div> inside <body>.

3) Build locally (prod mode) and preview:
   npm ci
   npm run build
   npm run preview
   # Open http://localhost:5173

4) Deploy to Vercel production:
   git add -A
   git commit -m "fix: SPA rewrite + Vite aliases + real App mount"
   vercel --prod

Notes:
- The aliases in vite.config.mts replace the vite-tsconfig-paths plugin.
- If your project uses a Router instead of App, change src/main.tsx to import your router and render <RouterProvider router={router} />.
- If the page is blank on Vercel, open the browser console for runtime errors (usually a case-sensitive path or missing file).
