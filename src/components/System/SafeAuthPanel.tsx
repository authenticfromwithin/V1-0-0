import React from "react";

const card: React.CSSProperties = {
  backdropFilter: "blur(6px)",
  background: "rgba(8,14,16,.55)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 16,
  padding: "22px 24px",
  color: "rgba(240,248,255,.94)",
  boxShadow: "0 8px 30px rgba(0,0,0,.35)",
  maxWidth: 460,
  lineHeight: 1.5
};

export default function SafeAuthPanel() {
  return (
    <div style={{display:"grid",placeItems:"center",minHeight:"40vh"}}>
      <div style={card} role="region" aria-label="Auth">
        <h3 style={{margin:"0 0 6px 0", fontWeight:700}}>Your Space</h3>
        <p style={{margin:"0 0 14px 0", opacity:.88}}>
          Auth service isn’t connected in this environment. UI is intentionally
          non-interactive so the home scene stays stable while we wire it up.
        </p>
        <div style={{display:"flex", gap:12}}>
          <button disabled style={{opacity:.6, cursor:"not-allowed"}}>Sign in</button>
          <button disabled style={{opacity:.6, cursor:"not-allowed"}}>Create profile</button>
        </div>
      </div>
    </div>
  );
}
