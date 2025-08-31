STEP 06 — Root favicon + Home guard (surgical)
- Adds /public/favicon.ico and /public/favicon.png (fixes 404 without editing index.html)
- Adds styles/home-guard.css (prevents avatar/video bleed on Home)
- Replaces src/pages/Home.tsx to set data-page="home" and import the guard CSS

Apply:
1) Unzip at repo root (overwrites the three files above).
2) npm run build && npm run preview
3) Verify:
   - http://localhost:5173/favicon.ico returns 200
   - Home shows ONLY forest plates + fire (no avatar animation)