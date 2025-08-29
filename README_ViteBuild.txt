AFW — Vite Build Fix Pack
===========================
Why
---
Vercel is running `react-scripts build` (CRA) and failing with "import outside src".
AFW is a **Vite** app. We switch the build script to Vite so the same code that built locally builds on Vercel.

What this pack changes
----------------------
- Overwrites **package.json** so scripts are:
    "dev": "vite"
    "build": "vite build"
    "preview": "vite preview"
- Ensures minimal dependencies for Vite: react, react-dom, vite, @vitejs/plugin-react, typescript.
- Keeps engines: Node 22, npm 10.

Steps
-----
1) Place **package.json** from this pack into your project root (replace-only).
2) Commit & push.
3) In Vercel → Deployments → Redeploy → check **Clear build cache**.
4) Build log should show: `vite v5 ... building for production...`

Notes
-----
- Do NOT add `node_modules/` to the repo.
- If you kept `package-lock.json`, it will pin versions; otherwise Vercel installs the listed versions.
- Your existing `vite.config.ts` + `tsconfig.json` aliases (`routes/*`, `journal/*`, etc.) will work as they did locally.
