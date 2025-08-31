STEP 01 — Core Stability + Campfire
===================================
Drop-in replacements:
- src/components/SceneParallax/Parallax.tsx
- src/pages/Home.tsx
- src/logic/auth/provider.ts
- styles/campfire.css

What this fixes:
- No `.map` on undefined (parallax)
- No `ref.current` function errors (home)
- Null-safe auth redirect (home)
- Real fire movement behind auth panel (video layer + screen blend)

Checklist after apply:
- DevTools → Network: /assets/scenes/forest/fire/fire.webm = 200
- Move mouse: subtle parallax; no console errors
- Logged-in → redirects to /quotes; logged-out → stays on Home
