STEP 08 — Home Scene Whitelist (final surgical clamp)
- Replaces Parallax.tsx to accept dataset on layers and pass to <video> as data-* attributes.
- Replaces Home.tsx to tag the fire video with data-afw-allow="home-fire", and nukes any stray background on #root.
- Adds styles/home-scene-lock.css: hides ALL videos/avatars on Home except the whitelisted fire.

Apply:
1) Unzip at repo root (overwrites Parallax.tsx and Home.tsx; adds one CSS file).
2) npm run build && npm run preview
3) Home should now show only forest plates + campfire glow; no avatar animation possible.