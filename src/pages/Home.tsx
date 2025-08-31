import React, { useEffect, useState } from 'react'
import Parallax from '@/components/SceneParallax/Parallax'
import LogoFire from 'components/ui/LogoFire'
import SignInUpModal from 'components/Auth/SignInUp'
import SupportPanel from 'components/Support/SupportPanel'
import { auth } from '@/logic/auth/provider';

export default function Home(){
  const [showAuth, setShowAuth] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  useEffect(() => { (async () => { const u = await (typeof auth.current==="function" && auth.current)(); if (u) { window.location.href = '/quotes' } })() }, [])
  return (
    <div style={wrap}>
      <div style={scene}><Parallax/><div style={fireGradient} aria-hidden="true"/></div>
      <div style={centerBox} role="dialog" aria-label="Welcome">
        <div style={logoRow}><LogoFire/></div>
        <h1 style={title}>By the fire, come back to yourself</h1>
        <p style={sub}>A sacred, cinematic space for healing and devotion. Your journal stays private on this device.</p>
        <div style={btnRow}>
          <button onClick={()=>setShowAuth(true)} style={btnPrimary}>Sign up</button>
          <button onClick={()=>setShowAuth(true)} style={btn}>Sign in</button>
          <button onClick={()=>setShowSupport(true)} style={btnGhost}>Need help?</button>
        </div>
        <div style={fineprint}>By continuing you agree to our non-sharing policy within this protected space.</div>
      </div>
      <SignInUpModal open={showAuth} onClose={()=>setShowAuth(false)} onAuth={()=>{ window.location.href='/quotes' }}/>
      <SupportPanel open={showSupport} onClose={()=>setShowSupport(false)} />
    </div>
  )
}

const wrap: React.CSSProperties = { position:'relative', minHeight:'100vh', color:'white' }
const scene: React.CSSProperties = { position:'absolute', inset:0, zIndex:0 }
const fireGradient: React.CSSProperties = { position:'absolute', inset:0, background:'radial-gradient(800px 500px at 60% 90%, rgba(255,150,90,0.28), rgba(0,0,0,0))' }
const centerBox: React.CSSProperties = { position:'relative', zIndex:2, minHeight:'100vh', display:'grid', placeItems:'center', padding:'24px' }
const logoRow: React.CSSProperties = { display:'flex', justifyContent:'center', marginBottom:10 }
const title: React.CSSProperties = { textAlign:'center', fontSize:'clamp(26px,5vw,52px)', margin:'0 0 8px' }
const sub: React.CSSProperties = { textAlign:'center', maxWidth:800, margin:'0 auto 16px', opacity:.92 }
const btnRow: React.CSSProperties = { display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }
const btn: React.CSSProperties = { padding:'10px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.16)', background:'rgba(255,255,255,0.08)', color:'white', cursor:'pointer', fontWeight:600 }
const btnPrimary: React.CSSProperties = { ...btn, background:'rgba(255,255,255,0.18)', borderColor:'rgba(255,255,255,0.28)' } as any
const btnGhost: React.CSSProperties = { ...btn, background:'transparent' } as any
const fineprint: React.CSSProperties = { textAlign:'center', opacity:.7, fontSize:12, marginTop:12 }








