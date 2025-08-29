AFW — Home + Sign-up (Hero) Pack
=====================================
What this gives you
-------------------
1) **Homepage file**: `src/pages/Home.tsx` (cinematic hero in Night Forest with clear CTAs)
2) **Sign-up handoff page** (already available if you used the previous pack): `public/signup.html`
3) **Floating Sign-up CTA** (if you applied the prior CTA pack): injected in `index.html` when `VITE_SIGNUP_URL` is set

Where things live
-----------------
- Homepage (React):    src/pages/Home.tsx
- Sign-up (static):    public/signup.html
- CTA injection:       index.html (reads `import.meta.env.VITE_SIGNUP_URL`)

How to configure the Sign-up URL
--------------------------------
- Local dev: create `.env.local` in project root and add:
    VITE_SIGNUP_URL=https://your-newsletter-url
- Vercel: Project → Settings → Environment Variables:
    Key: VITE_SIGNUP_URL
    Value: https://your-newsletter-url
    Scope: Production (and Preview if desired)
Then redeploy (Clear build cache).

Install (replace-only)
----------------------
Unzip at your project root to overwrite **only**:
- src/pages/Home.tsx

No other files are touched. Build and deploy normally.
