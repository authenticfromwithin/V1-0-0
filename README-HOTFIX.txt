AFW Runtime Hotfix
====================

This hotfix prevents a production crash caused by an invalid CSS selector string like `*,:x`,
which was throwing a `SyntaxError` and blanking the page.

What this contains
------------------
1) index.html
   - Adds a small inline <script> that sanitizes invalid selectors in DOM/CSS insert calls
     (querySelector/querySelectorAll/matches and CSSStyleSheet.insertRule/replace*).
   - This runs *before* your Vite bundle loads, so the app won't crash.

2) vite.config.ts (optional)
   - Enables source maps in production for easier debugging.
   - Adds a tiny `process.env` shim to avoid runtime errors from libraries that expect it.

How to apply
------------
1) Copy *both files* to your project root (same folder as package.json).
   - Allow overwrite of your current index.html.
2) Commit & push to your GitHub repo (which is connected to Vercel):
   git add index.html vite.config.ts
   git commit -m "fix: runtime guard for '*,:x' selector crash"
   git push
3) Wait for Vercel to build & deploy. Then refresh your Production URL.

Notes
-----
- You can leave this guard in place permanently; it’s no-op unless a string contains `:x`.
- Later, if you find which dependency emits the `*,:x` selector, you can remove the guard.
