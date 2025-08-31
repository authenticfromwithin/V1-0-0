STEP 02 — Routes + Pages
========================
Create/replace:
- src/pages/HeavenlyExpress.tsx   (survey-only, hidden from nav)
- src/pages/Donate.tsx            (Donations page; lantern-path background placeholder)

Wire routes (small manual edit in your router file, e.g., src/App.tsx):
- See routes.additions.txt (imports + <Route> lines)
- Do NOT add Heavenly Express to header/nav

Checklist after apply:
- /heavenly loads survey page (but not linked in header)
- /donate loads donations page
