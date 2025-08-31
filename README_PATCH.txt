AFW Patch Bundle — 2025-08-31

Files included (drop into project root):
- vite.config.ts
- src/logic/auth/current-shim.ts
- src/components/AuthPanel.tsx
- src/components/SceneParallax/Parallax.tsx
- src/pages/Home.tsx
- src/styles/scene-parallax.css

PowerShell (run in project root):

  # sanity checks
  Test-Path .\vite.config.ts
  Test-Path .\src\logic\auth\current-shim.ts
  Test-Path .\src\components\AuthPanel.tsx
  Test-Path .\src\components\SceneParallax\Parallax.tsx
  Test-Path .\src\pages\Home.tsx
  Test-Path .\src\styles\scene-parallax.css

  # build and preview
  npm run build
  npm run preview -- --host --port 5173

  # deploy
  vercel deploy --prod

Notes:
- Auth redirect is guarded via getCurrentSafe(); only redirects when a user exists.
- Parallax has full guards and rAF cleanup; no .map on undefined.
- Campfire is a video layer with mix-blend-mode: screen; plates remain behind.
- No typography/spacing changes.
