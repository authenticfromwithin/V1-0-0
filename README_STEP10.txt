STEP 10 — Route + Stay Flag
- Ensures "/" renders Home.
- Adds ?stay to bypass auth redirect so you SEE Home even if you're logged in.
- Adds base-safe.css for full-viewport layout.

Apply:
1) Unzip at repo root.
2) npm run build; npm run preview -- --host --port 5173
3) Open http://127.0.0.1:5173/?stay
