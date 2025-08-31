import React from "react";

type Props = {
  className?: string;
  onSignedIn?: () => void;
};

export default function AuthPanel({ className = "", onSignedIn }: Props){
  return (
    <div className={className} style={panelStyle}>
      <h2 style={titleStyle}>Welcome back</h2>
      <div style={rowStyle}>
        <input placeholder="Email" style={inputStyle} />
      </div>
      <div style={rowStyle}>
        <input type="password" placeholder="Password" style={inputStyle} />
      </div>
      <div style={{display:"flex", gap:12, marginTop:12}}>
        <button style={btnStyle} onClick={onSignedIn}>Sign In</button>
        <button style={btnGhost}>Create Account</button>
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  width: 360,
  maxWidth: "90vw",
  padding: 20,
  borderRadius: 14,
  background: "rgba(6,16,23,.52)",
  border: "1px solid rgba(255,255,255,.08)",
  boxShadow: "0 10px 40px rgba(0,0,0,.35)",
  backdropFilter: "blur(6px)",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: 10,
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: .3
};

const rowStyle: React.CSSProperties = { marginTop: 10 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(0,0,0,.25)",
  color: "#e9eef3"
};
const btnStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,140,60,.55)",
  background: "linear-gradient(180deg, rgba(255,140,60,.45), rgba(255,90,25,.35))",
  color: "#fff",
  cursor: "pointer"
};
const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.18)",
  background: "transparent",
  color: "#e9eef3",
  cursor: "pointer"
};