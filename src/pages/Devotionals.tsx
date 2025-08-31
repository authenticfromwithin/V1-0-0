import React from 'react'
import RequireAuth from '@/guards/RequireAuth'
type Dev = { id:string; title:string; date?:string; path?:string }
export default function Devotionals(){
  const [list,setList]=React.useState<Dev[]>([])
  const [err,setErr]=React.useState<string|null>(null)
  React.useEffect(()=>{ (async()=>{
    try{
      const res = await fetch('/content/devotionals.manifest.json')
      const j = await res.json(); setList(j.items||[])
    }catch(e:any){ setErr('Failed to load devotionals') }
  })() },[])
  return (<RequireAuth>
    <div style={{padding:'24px', color:'white'}}>
      <h2>Devotionals</h2>
      {err && <div style={{color:'#ffb4b4'}}>{err}</div>}
      <ul style={{display:'grid', gap:8, listStyle:'none', padding:0}}>
        {list.map(d=>(<li key={d.id} style={card}><div style={{fontWeight:600}}>{d.title}</div><div style={{opacity:.8,fontSize:12}}>{d.date||''}</div></li>))}
      </ul>
    </div>
  </RequireAuth>)
}
const card:React.CSSProperties={border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,padding:12,background:'rgba(255,255,255,0.06)'}



