AFW Bulletproof Kit v3 (surgical)
---------------------------------
Files here are minimal, safe replacements or additions.
- vercel.json -> static build + SPA fallback
- vite.config.ts -> pure ESM with plugin-react + tsconfig-paths
- styles/*.css -> placeholders to satisfy imports; keep your design
- src/logic/auth/provider.ts -> exports async current()
- src/components/AuthPanel/AuthPanel.tsx + wrapper AuthPanel.tsx
- src/components/auth/index.ts -> legacy import safety
- src/components/SceneParallax/Parallax.tsx -> map/RAF guards
- src/pages/Home.tsx -> campfire + forest plates behind AuthPanel

Apply:
  1) Drop zip in project root and extract (overwrite).
  2) Ensure tsconfig paths align with tsconfig.json.hardwire-example.
  3) npm install
  4) npm run build && npm run preview
  5) vercel pull && vercel build && vercel deploy --prod