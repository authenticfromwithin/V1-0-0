AFW Surgical Bundle — Parallax + Home + Auth + Heavenly (Hidden)
================================================================

This bundle is *surgical* and matches the agreed AFW spec (cinematic forest night, campfire behind auth panel, hidden Heavenly Express, no redesign).

Included (drop-in):
- src/components/SceneParallax/Parallax.tsx
- src/pages/Home.tsx
- src/logic/auth/provider.ts
- src/pages/HeavenlyExpress.tsx
- styles/campfire.css

What this does
--------------
1) Parallax safety:
   - `layers` defaults to `[]` so `.map` never crashes.
   - Guarded refs + rAF cleanup; pointer is passive; transforms only.
   - Supports both image and video layers.

2) Home (campfire composite + guards):
   - Fire *video* sits behind your auth panel; glow uses `mix-blend-mode: screen`.
   - Ref guard prevents "ref.current is not a function".
   - Null-safe auth redirect: `const user = await auth.current?.(); if (user) navigate("/quotes")`
   - Keeps your existing panel; no typography/spacing changes.

3) Auth provider contract:
   - `auth.current(): Promise<User|null>` implemented as a stub; replace with your provider.
   - Home uses this safely.

4) Heavenly Express (hidden at launch):
   - Adds a survey-only page `src/pages/HeavenlyExpress.tsx`.
   - **Do not** add it to header/nav; keep the route present-in-code for later enablement.

To add routes (one small edit)
------------------------------
Open your router (usually `src/App.tsx`) and add:
  import HeavenlyExpress from "@/pages/HeavenlyExpress";

Inside `<Routes>` add (keep it out of your header/nav):
  <Route path="/heavenly" element={<HeavenlyExpress />} />

(If you also want a Donations route, add:
  import Donate from "@/pages/Donate";
  <Route path="/donate" element={<Donate />} />
)

Fire media
----------
Ensure the following files exist (or update paths in Home.tsx):
  /public/assets/scenes/forest/plates/back.webp
  /public/assets/scenes/forest/plates/mid.webp
  /public/assets/scenes/forest/plates/front.webp
  /public/assets/scenes/forest/fire/fire.webm

Build notes
-----------
- Vite 5 + React 18 + TS. No new deps.
- Home imports styles/campfire.css (no global layout change).

Result
------
- No .map crashes, no bad ref calls.
- Cinematic campfire movement behind the auth panel.
- Heavenly Express route present but hidden from nav.
