STEP 12 — Fix "Unexpected token '<'" on Vercel
----------------------------------------------
Cause:
Your previous `vercel.json` rewrote **every** request to `/index.html`. That means
requests for `/assets/index-*.js` returned HTML, so the browser throws:
  - "Unexpected token '<'"
  - "Failed to load module script ... MIME type 'text/html'"

Fix:
Use a filesystem pass-through **before** the SPA fallback.

vercel.json:
  {
    "version": 2,
    "builds": [
      { "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
    ],
    "routes": [
      { "handle": "filesystem" },
      { "src": "/(.*)", "dest": "/index.html" }
    ]
  }

Apply:
  Copy this vercel.json to your repo root, commit, push OR deploy via CLI:
    vercel pull
    vercel build
    vercel deploy --prod

Verify (after deploy):
  - Navigate to https://<your-domain>/assets/index-*.js directly. It should return JS, not HTML.
  - App loads without console errors.
