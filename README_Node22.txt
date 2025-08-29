AFW — Node 22 Pack
=====================

Goal
----
Force Vercel to use **Node.js 22.x** for builds without needing a dashboard toggle.

What this pack contains
-----------------------
- .nvmrc           → "22"
- .node-version    → "22"
- README_Node22.txt
- package.json.engines.snippet.json → copy/paste into your package.json

Required change in package.json
-------------------------------
Add (or update) this block at the top level of package.json:

  "engines": {
    "node": ">=22 <23",
    "npm": ">=10"
  },
  "packageManager": "npm@10"

Notes:
- Keep valid JSON (commas!).
- Do NOT remove any existing fields.
- Vercel respects `engines.node` for build/runtime. The .nvmrc/.node-version files help local dev and some CI flows.

Steps
-----
1) Drop `.nvmrc` and `.node-version` into your project root.
2) Edit `package.json` and add the engines block above.
3) Commit + push to GitHub.
4) In Vercel → Deployments → Redeploy (Clear build cache).
5) Confirm in Vercel logs near the top you see "Using Node.js v22.x".

If you still see an older Node version in logs, ping me with the exact line and I’ll adjust immediately.
