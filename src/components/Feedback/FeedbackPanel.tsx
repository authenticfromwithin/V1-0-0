import React from 'react'
import { supabase } from '@/logic/auth/supabaseAuth'
import { auth } from '@/logic/auth/provider';
const SUBJECT_MAX = 100
const MESSAGE_MAX = 600
type Props={ open:boolean; onClose():void }
export default function FeedbackPanel({open,onClose}:Props){
  const [subject,setSubject]=React.useState('')
  const [message,setMessage]=React.useState('')
  const [status,setStatus]=React.useState<'idle'|'sending'|'sent'|'error'>('idle')
  const [error,setError]=React.useState<string|null>(null)
  const valid = subject.trim().length>0 && subject.length<=SUBJECT_MAX && message.trim().length>0 && message.length<=MESSAGE_MAX
  async function send(){
    try{
      setStatus('sending'); setError(null)
      const me = await auth.current()
      if(supabase){
        const { error:e1 } = await supabase.from('feedback').insert({ t: Date.now(), subject, message, user_id: me?.id || null })
        if(e1) throw e1
      }
      setStatus('sent'); setSubject(''); setMessage('')
    }catch(e:any){ setStatus('error'); setError(e?.message||'Failed to send') }
  }
  if(!open) return null
  return(<div style={wrap} role="dialog" aria-modal="true" aria-label="Feedback">
    <div style={card}>
      <div style={rowTop}><strong>Send Feedback</strong><button onClick={onClose} style={btn}>Close</button></div>
      {status==='sent' && <div className="good" style={{marginBottom:8}}>Thank you — your feedback was sent.</div>}
      {status==='error' && <div className="bad" style={{marginBottom:8}}>{error}</div>}
      <div style={row}><input placeholder="Subject" maxLength={SUBJECT_MAX} value={subject} onChange={e=>setSubject(e.target.value)} style={input}/><div style={hint}>{subject.length}/{SUBJECT_MAX}</div></div>
      <div style={row}><textarea placeholder="Write your message…" maxLength={MESSAGE_MAX} value={message} onChange={e=>setMessage(e.target.value)} style={{...input,minHeight:120}} /><div style={hint}>{message.length}/{MESSAGE_MAX}</div></div>
      <div style={row}><button onClick={send} style={btn} disabled={status==='sending'||!valid}>{status==='sending'?'Sending…':'Send'}</button></div>
    </div>
  </div>)
}
const wrap:React.CSSProperties={position:'fixed',inset:0,display:'grid',placeItems:'center',background:'rgba(0,0,0,0.55)',zIndex:9999}
const card:React.CSSProperties={width:'min(560px,92vw)',padding:16,borderRadius:14,background:'rgba(10,10,10,0.7)',border:'1px solid rgba(255,255,255,0.12)',color:'white'}
const rowTop:React.CSSProperties={display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}
const row:React.CSSProperties={display:'grid',gap:6,margin:'8px 0'}
const input:React.CSSProperties={padding:'10px 12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.06)',color:'inherit'}
const btn:React.CSSProperties={padding:'8px 12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',color:'inherit',cursor:'pointer'}
const hint:React.CSSProperties={fontSize:12,opacity:.7,justifySelf:'end'}



