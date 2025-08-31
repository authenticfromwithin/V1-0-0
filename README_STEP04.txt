STEP 04 — Vercel SPA Config
===========================
File:
- vercel.json

Purpose:
- Ensures client-side routes (e.g., /quotes, /heavenly, /donate) resolve to index.html on Vercel.
- Prevents 404 on refresh or direct deep links.

Deploy notes:
- Commit vercel.json at repo root.
- Push to GitHub → Vercel will apply rewrite automatically.
