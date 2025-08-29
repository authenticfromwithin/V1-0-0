AFW — Repo Housekeeping Pack
================================
Includes:
- LICENSE-MIT.txt (permissive open-source)
- LICENSE-PROPRIETARY.txt (all rights reserved)
- .gitignore (Node/Vite/OS/IDE)
- .gitattributes (Git LFS for media/fonts)

How to use
----------
1) Choose ONE license:
   - If you want AFW open-sourced → rename **LICENSE-MIT.txt** to **LICENSE**.
   - If you want AFW private/proprietary → rename **LICENSE-PROPRIETARY.txt** to **LICENSE**.
   Commit only **one** LICENSE file.
2) Place **.gitignore** and **.gitattributes** in your project root.
3) In GitHub Desktop, commit with a message like:
   "Repo housekeeping: license + LFS + ignore".

Notes
-----
- Keep `package-lock.json` in version control for reproducible builds on Vercel.
- Do NOT commit `node_modules/` or `dist/` — Vercel installs/builds them.
- LFS patterns cover video/audio/fonts/plates (`.webp`). Ensure Git LFS is installed/initialized.
