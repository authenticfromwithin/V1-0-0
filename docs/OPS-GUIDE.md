
# AFW — Operations Guide (Node 22 + Vite)

This folder preserves your operational knowledge without touching runtime. It includes:
- **Scene/Audio/Avatar checklists** per theme/state
- **Legacy file maps** (old CRA paths → new Vite paths)
- **Content schemas** (devotionals/quotes)
- **Privacy guard notes**
- **Deployment settings** (Vercel/Vite/Node 22)
- **Asset contract** and strict prebuild gate reference

## Source of Truth

Runtime reads **only** from `/public/**` and `src/**`. Documentation lives in `/docs/**`.  
Builds fail if required media is missing when you enable the strict asset gate.

## Useful Commands

```bash
# Verify the asset contract (strict CI gate)
node scripts/check-asset-contract.mjs --strict

# Local dev
nvm use 22
npm ci
npm run dev

# Build & preview
npm run build
npm run preview
```

