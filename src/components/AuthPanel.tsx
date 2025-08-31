import React from "react";
import { current } from "logic/auth/provider";

export default function AuthPanel(){
  const [session, setSession] = React.useState<Awaited<ReturnType<typeof current>>>(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      const s = await current();
      if (alive) setSession(s);
    })();
    return () => { alive = false; }
  }, []);

  return (
    <div style={{
      position:'relative', width:380, maxWidth:'92vw', padding:'20px 18px',
      borderRadius:16, background:'rgba(8,12,14,.55)', backdropFilter:'blur(6px)',
      border:'1px solid rgba(255,255,255,.06)'
    }}>
      <h2 style={{marginTop:0, color:'#ffd7b3'}}>Welcome</h2>
      {session ? (
        <div style={{color:'#cde'}}>Signed in.</div>
      ) : (
        <div style={{color:'#cde'}}>Sign in coming soon.</div>
      )}
    </div>
  );
}