SAFE FIXES ONLY (no design changes)
====================================

What this does
--------------
- Prevents `.map(...)` from throwing when `layers` is undefined in `Parallax.tsx`
- Guards `auth.current()` in `Home.tsx` so it won't throw if not a function
- Normalizes ErrorBoundary *import path casing* in `main.tsx` (no UI change)

What this does NOT do
---------------------
- No CSS added or changed
- No components replaced
- No visual overlays or theming changes

How to apply
------------
1) Copy the `scripts/fixers/safe-fixes.mjs` into your repo (same paths as here).
2) From your project root, run:
   node scripts/fixers/safe-fixes.mjs

3) Inspect the console JSON to see which files were patched.
4) Build locally:
   npm run build

5) Commit and deploy:
   git add -A
   git commit -m "chore: safe runtime guards (no design change)"
   git push origin main
   vercel --prod

Rollback
--------
The script is purely textual. If you want to revert, use `git restore` on the touched files.
