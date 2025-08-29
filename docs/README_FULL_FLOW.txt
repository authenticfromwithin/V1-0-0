AFW — Full Flow Delta Pack (Replace-only)

What this delivers
------------------
- Public **sign-up / sign-in** (Supabase) to keep user progress.
- **Profile** panel (display name, preferred theme, avatar archetype) saved to `profiles_public`.
- **Progress** recording (per-user) saved to `progress_events`.
- **Full dropdown menu**: Healing, My Journey, Devotionals, Quotes, Profile, Settings, Theme quick-picks, Privacy/Terms, Sign out.
- **Settings** panel for reduce motion, audio master, theme, and NDJSON export of local analytics.
- **Admin** dashboard extended with a **Profiles** tab (read-only).

Install
-------
Place files at the exact paths listed; overwrite where names match. Then:
1) Add env to both Vercel projects: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
2) In Supabase, run `docs/SQL_Full_Integration.txt` once.
3) Redeploy Website (root) and Admin (admin/).
4) Test: sign up, set profile, use Healing/Journey, check Admin tabs (Events/Progress/Profiles).

Notes
-----
- Journals remain local-only (not uploaded).
- If Supabase env is missing, public auth won’t work.
