import React from 'react'
import RequireAuth from 'guards/RequireAuth'
type Quote = { text:string; context?:string; reflection?:string; category?:string }
export default function Quotes(){
  const [rows,setRows]=React.useState<Quote[]>([])
  const [i,setI]=React.useState(0)
  const [err,setErr]=React.useState<string|null>(null)
  React.useEffect(()=>{ (async()=>{
    try{
      const res = await fetch('/content/quotes.manifest.json')
      const j = await res.json(); setRows(j.quotes||[])
    }catch(e:any){ setErr('Failed to load quotes') }
  })() },[])
  const q = rows[i] || null
  function next(){ if(rows.length) setI((i+1)%rows.length) }
  return (<RequireAuth>
    <div style={{padding:'24px', color:'white'}}>
      <h2>Quotes</h2>
      {err && <div style={{color:'#ffb4b4'}}>{err}</div>}
      {q ? (<div style={card}><div style={{fontSize:18, marginBottom:8}}>{q.text}</div>{q.context && <div style={{opacity:.85, marginBottom:6}}>{q.context}</div>}{q.reflection && <div style={{opacity:.8, fontStyle:'italic'}}>{q.reflection}</div>}</div>) : <div>Loading…</div>}
      <div style={{marginTop:12}}><button onClick={next} style={btn}>New quote</button></div>
    </div>
  </RequireAuth>)
}
const card:React.CSSProperties={border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,padding:16,background:'rgba(255,255,255,0.06)'}
const btn:React.CSSProperties={padding:'8px 12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',color:'inherit',cursor:'pointer'}
