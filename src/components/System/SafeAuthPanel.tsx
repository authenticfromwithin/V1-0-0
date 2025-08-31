import React from "react";

export default function SafeAuthPanel() {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const disabled = true; // demo-only, non-functional

  return (
    <div style={root}>
      <h2 style={h2}>Your Space</h2>
      <div style={row}>
        <input style={input} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div style={row}>
        <input style={input} placeholder="Passphrase" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
      </div>
      <div style={{display:'flex', gap:12, marginTop:12}}>
        <button disabled={disabled} style={btn}>Sign in</button>
        <button disabled={disabled} style={btn}>Create profile</button>
      </div>
      <p style={hint}>Demo fallback only. Your real AuthPanel will load automatically when present.</p>
    </div>
  );
}

const root: React.CSSProperties = {
  backdropFilter: 'blur(6px)',
  background: 'rgba(5,10,12,.55)',
  border: '1px solid rgba(255,255,255,.06)',
  borderRadius: 16,
  padding: 20,
  width: 360,
  color: '#e9eef1',
  boxShadow: '0 15px 40px rgba(0,0,0,.35)',
};

const h2: React.CSSProperties = { margin: 0, marginBottom: 12, fontWeight: 600, letterSpacing: '.02em' };
const row: React.CSSProperties = { marginTop: 10 };
const input: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,.12)',
  background: 'rgba(0,0,0,.25)', color: '#e9eef1'
};
const btn: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,.14)',
  background: 'rgba(0,0,0,.35)', color: '#e9eef1', cursor: 'not-allowed'
};
const hint: React.CSSProperties = { opacity: .7, fontSize: 12, marginTop: 12 };
