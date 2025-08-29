AFW – UI Gateway Wiring Pack
================================
Purpose: minimal UI glue to use the new /api gateway (no direct Supabase in browser).

DROP-IN (replace-only)
----------------------
1) Place `src/guards/RequireAuth.tsx` at that exact path (overwrite existing if present).
2) (Optional) Run the QA script to confirm file presence.

QA
--
node scripts/qa/expect-ui-gateway.mjs

WHAT RequireAuth DOES
---------------------
- Calls GET /api/profile to verify session.
- If 401, redirects to '/' (Home) and shows nothing.
- While loading, shows a minimal, accessible spinner.
