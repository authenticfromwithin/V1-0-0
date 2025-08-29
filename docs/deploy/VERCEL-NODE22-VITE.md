
# Deployment — Vercel + Vite + Node 22

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: `22.x`
- `vercel.json` includes SPA rewrites to `/index.html`.

**Strict Asset Gate**
- `scripts/asset-contract.json` (source of truth for required assets)
- `scripts/check-asset-contract.mjs --strict` (fail build if anything is missing/suspicious).

**Git LFS**
- Configure `.gitattributes` to track `*.webm, *.mp4, *.mp3, *.ogg, *.webp, *.wav, *.mov, *.m4a`.
