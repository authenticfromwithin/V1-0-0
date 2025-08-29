AFW Fonts Fetcher
=================

What this does
--------------
- Creates `/public/assets/fonts/{ui,latin,greek,hebrew}`
- Downloads **Inter Variable (normal & italic)** from the official Inter repo
- Installs Fontsource variable packages and copies **Noto Serif (latin)**, **Noto Sans Greek**, and **Noto Sans Hebrew** `.woff2` files locally.
- Uses `public/fonts.css` to wire them into the app (already pointing at `/assets/fonts/...`).

How to run (Windows/macOS/Linux)
--------------------------------
1) Open a terminal at your project root.
2) Run: `node scripts/fetch-fonts.mjs`
   - It will `npm i` the needed Fontsource packages (no lockfile changes).

After running
-------------
- Verify that these files exist:
  - `public/assets/fonts/ui/InterVariable.woff2`
  - `public/assets/fonts/ui/InterVariable-Italic.woff2`
  - `public/assets/fonts/latin/NotoSerif-Variable.woff2`
  - `public/assets/fonts/greek/NotoSansGreek-Variable.woff2`
  - `public/assets/fonts/hebrew/NotoSansHebrew-Variable.woff2`

Licenses
--------
- Inter: SIL Open Font License 1.1 — https://rsms.me/inter/ (and repo LICENSE)
- Noto family: SIL Open Font License 1.1 — https://github.com/notofonts

No runtime network: fonts are served from your `/public` after this.