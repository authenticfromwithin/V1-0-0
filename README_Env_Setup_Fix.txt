AFW – Env Setup (Fixed)
===========================

If PowerShell gave a parse error, use THIS updated script.

RUN (PowerShell, at project root)
---------------------------------
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup\set-env.ps1

When prompted, paste:
- Project URL (example: https://abcd1234.supabase.co)
- anon public key (starts with eyJ...)

ALTERNATIVE (Node.js)
---------------------
node scripts\setup\set-env.mjs

VERIFY
------
node scripts\setup\verify-env.mjs
