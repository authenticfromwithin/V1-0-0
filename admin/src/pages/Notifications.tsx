import React from 'react'
import { supabase } from '../logic/supabaseClient'
type Row = { id:number; audience:string; title:string; body?:string }
export default function Notifications(){
  const [rows,setRows]=React.useState<Row[]>([])
  const [title,setTitle]=React.useState('')
  const [body,setBody]=React.useState('')
  const [audience,setAudience]=React.useState('all')
  const [err,setErr]=React.useState<string|null>(null)
  async function load(){
    try{
      if(!supabase) return
      const { data, error } = await supabase.from('notifications_public').select('*').order('id',{ascending:false}).limit(200)
      if(error) throw error
      setRows((data as any)||[])
    }catch(e:any){ setErr(e?.message||'Failed') }
  }
  async function send(){
    try{
      if(!supabase) return
      const { error } = await supabase.from('notifications_public').insert({ audience, title, body })
      if(error) throw error
      setTitle(''); setBody(''); load()
    }catch(e:any){ setErr(e?.message||'Failed to send') }
  }
  React.useEffect(()=>{ load() },[])
  return (<div className="card">
    <div className="controls">
      <select value={audience} onChange={e=>setAudience(e.target.value)}>
        <option value="all">All</option>
      </select>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Body" value={body} onChange={e=>setBody(e.target.value)} />
      <button onClick={send}>Send</button>
      <button onClick={load}>Refresh</button>
    </div>
    {err && <div className="bad">{err}</div>}
    <table className="table"><thead><tr><th>ID</th><th>Audience</th><th>Title</th><th>Body</th></tr></thead>
    <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.audience}</td><td>{r.title}</td><td>{r.body||''}</td></tr>))}</tbody></table>
  </div>)
}
