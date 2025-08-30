AFW Vite Runtime Guard
=======================

What is this?
-------------
This index.html includes a small "runtime guard" that prevents the page from
crashing on startup due to an invalid CSS selector error like:
    SyntaxError: '*,:x' is not a valid selector

Where to put it
---------------
1) Place this file at the project root as:  ./index.html
   (This is the standard entry for a Vite app. The build will rewrite it
    and output the hashed JS into ./dist automatically.)

2) Commit and deploy:
     git add index.html
     git commit -m "fix: add runtime selector guard"
     git push
     vercel --prod

How to verify
-------------
After deploy, open:
  https://YOUR_DOMAIN/?v=guard1
And check that the page is no longer blank. You can also fetch index.html and
confirm it contains the marker 'AFW_RUNTIME_GUARD' before the app script.
