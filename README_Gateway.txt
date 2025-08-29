AFW – Gateway Pack (No direct Supabase from browser)
=========================================================
Drop this into your project root. It adds Vercel Serverless API routes so the SPA calls ONLY your endpoints.
Users never see Supabase URL/keys; you keep full control.

Place at project root:
- api/_lib/supabase.ts
- api/auth/{signup.ts, signin.ts, signout.ts}
- api/profile/{index.ts, post.ts}
- api/admin/notifications/{index.ts, create.ts}
- src/logic/{authClient.ts, profileClient.ts}
- scripts/qa/expect-gateway.mjs

Environment (Vercel -> Settings -> Environment Variables) for BOTH website and admin projects:
- SUPABASE_URL = https://YOUR_PROJECT.supabase.co
- SUPABASE_ANON_KEY = eyJ... (anon public)
- SUPABASE_SERVICE_ROLE_KEY = eyJ... (service role)  <-- keep server-only
- SESSION_COOKIE_NAME = afw_sess
- SESSION_COOKIE_DOMAIN = your-site.vercel.app (or custom domain)
- SESSION_COOKIE_SECURE = true

Local dev is fine without SESSION_COOKIE_DOMAIN.

Client wiring:
Replace direct supabase.auth.* calls with functions from:
- src/logic/authClient.ts  (signup, signin, signout, me)
- src/logic/profileClient.ts (getProfile, updateProfile)

QA:
node scripts/qa/expect-gateway.mjs
