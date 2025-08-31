STEP 05 — Brand + Nav Hide + Lantern Helper
Drop-in:
- public/assets/brand/*  (logo + favicon + ico)
- public/assets/lantern/path.jpg
- src/components/Brand/LogoMark.tsx
- styles/brand.css
- patches/index.head.patch.html
- patches/nav.hide.txt

Apply:
1) Unzip at repo root.
2) Edit index.html: paste lines from patches/index.head.patch.html into <head>.
3) Import brand.css once (e.g., in src/main.tsx):  import '@/../styles/brand.css';
4) Use <LogoMark size={48} /> where needed.
5) Keep /heavenly out of nav; /donate optional.
