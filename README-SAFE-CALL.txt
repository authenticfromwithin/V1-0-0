SAFE CALL FIX FOR auth.current()

WHAT THIS DOES
--------------
Replaces unsafe calls like:
  const u = await (typeof auth.current==="function" && auth.current)();
with a safe version that won't attempt to invoke `false()` when `auth.current` isn't a function.

FILES
-----
- scripts/fixers/safe-call-auth-current.mjs  (the fixer script)

HOW TO USE
----------
1) Unzip this into your project root (so the script lands at scripts/fixers/safe-call-auth-current.mjs)
2) Run:
     node scripts/fixers/safe-call-auth-current.mjs
3) Commit and deploy:
     git add src/pages/Home.tsx
     git commit -m "fix(Home): safe-call auth.current()"
     git push origin main
     vercel --prod

NOTES
-----
If the script prints "No matching unsafe pattern found", your file may already be fixed or formatted differently.
Open src/pages/Home.tsx and ensure your useEffect IIFE looks like this:

  useEffect(() => {
    (async () => {
      const cur = auth?.current;
      const u = typeof cur === "function" ? await cur() : null;
      if (u) window.location.href = "/quotes";
    })();
  }, []);
