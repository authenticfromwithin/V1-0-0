import React, { useEffect, useState } from 'react'
import { auth } from 'logic/auth/provider';
import { upsertMyProfile } from 'logic/profile/profiles'
import { supabase } from 'logic/auth/supabaseAuth'
import type { User } from 'logic/auth/auth'
type Mode='signin'|'signup'
type Props={ open:boolean; onClose():void; onAuth(u:User|null):void }
const SignInUpModal:React.FC<Props>=({open,onClose,onAuth})=>{
  const [mode,setMode]=useState<Mode>('signin')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [first,setFirst]=useState('')
  const [last,setLast]=useState('')
  const [err,setErr]=useState<string|null>(null)
  const [loading,setLoading]=useState(false)
  useEffect(()=>{ if(!open){ setEmail(''); setPassword(''); setFirst(''); setLast(''); setErr(null) } },[open])
  async function go(){
    try{
      setLoading(true); setErr(null)
      if(mode==='signup'){
        if(!first.trim()||!last.trim()) throw new Error('Please provide name and surname.')
        if(supabase){
          const { data: existing, error } = await supabase.from('profiles_public').select('first_name,last_name').eq('first_name', first.trim()).eq('last_name', last.trim()).limit(1)
          if(error) console.warn('name check failed', error)
          if(existing && existing.length) throw new Error('An account with this name already exists. Please sign in or add a middle initial.')
        }
        const u = await auth.signUp(email, password)
        await upsertMyProfile({ first_name:first.trim(), last_name:last.trim(), display_name: `${first.trim()} ${last.trim()}` })
        onAuth(u); return
      }else{
        const u = await auth.signIn(email, password)
        onAuth(u); return
      }
    }catch(e:any){ setErr(e?.message || 'Authentication failed') }finally{ setLoading(false) }
  }
  if(!open) return null
  const cantGo = mode==='signup' ? !(email&&password&&first&&last) : !(email&&password)
  return(<div style={wrap} role="dialog" aria-modal="true" aria-label="Sign in or Sign up">
    <div style={card}>
      <div style={rowTop}><strong>{mode==='signin'?'Sign in':'Create account'}</strong></div>
      {mode==='signup' && (<div style={row}>
        <input placeholder="Name" value={first} onChange={e=>setFirst(e.target.value)} style={input}/>
        <input placeholder="Surname" value={last} onChange={e=>setLast(e.target.value)} style={input}/>
      </div>)}
      <div style={row}>
        <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={input}/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={input}/>
      </div>
      {err && <div style={bad}>{err}</div>}
      <div style={row}>
        <button onClick={go} style={btn} disabled={loading||cantGo}>{loading?'Please waitâ€¦':(mode==='signin'?'Sign in':'Create account')}</button>
        <button onClick={onClose} style={{...btn,opacity:.7}}>Cancel</button>
      </div>
      <div style={muted}>{mode==='signin'?<>No account yet? <a onClick={()=>setMode('signup')} style={link}>Create one</a></>:<>Have an account? <a onClick={()=>setMode('signin')} style={link}>Sign in</a></>}</div>
    </div>
  </div>)
}
const wrap:React.CSSProperties={position:'fixed',inset:0,display:'grid',placeItems:'center',background:'rgba(0,0,0,0.5)',zIndex:9999}
const card:React.CSSProperties={width:'min(560px,92vw)',padding:16,borderRadius:14,background:'rgba(10,10,10,0.65)',border:'1px solid rgba(255,255,255,0.12)',backdropFilter:'blur(8px)',color:'white'}
const rowTop:React.CSSProperties={display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}
const row:React.CSSProperties={display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}
const input:React.CSSProperties={flex:1,minWidth:220,padding:'10px 12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.06)',color:'inherit'}
const btn:React.CSSProperties={padding:'10px 12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',color:'inherit',cursor:'pointer',fontWeight:600}
const muted:React.CSSProperties={fontSize:12,opacity:.8}
const bad:React.CSSProperties={fontSize:12,color:'#ffb4b4',marginBottom:8}
const link:React.CSSProperties={cursor:'pointer',textDecoration:'underline'}
export default SignInUpModal


