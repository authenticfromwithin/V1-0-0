AFW – API + Vite Config Pack (Replace-Only)
=============================================
Drop this into your project root. It provides full /api gateway files and a complete vite.config.ts
with the dev proxy so local UI can call your serverless functions.

WHAT'S INCLUDED
- vite.config.ts (full file, with aliases + /api proxy → http://localhost:3000)
- api/_lib/supabase.ts
- api/auth/{signup.ts, signin.ts, signout.ts}
- api/profile/{index.ts, post.ts}
- api/admin/notifications/{index.ts, create.ts}
- scripts/qa/expect-gateway.mjs

LOCAL ENV (functions) — DO NOT paste in terminal
Create a file named `.env` at project root with:
-------------------------------------------------
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJ...anon
SUPABASE_SERVICE_ROLE_KEY=eyJ...service-role
SESSION_COOKIE_NAME=afw_sess
SESSION_COOKIE_SECURE=false

Then run:
vercel dev   # serves /api at http://localhost:3000
npm run dev  # serves UI at http://localhost:5173 with proxy to /api
