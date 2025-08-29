import React from 'react'
import { supabase } from '../logic/supabaseClient'
type Row = { id:number; t:number; user_id?:string; subject?:string; message?:string }
export default function Feedback(){
  const [rows,setRows]=React.useState<Row[]>([])
  const [err,setErr]=React.useState<string|null>(null)
  async function load(){
    try{
      if(!supabase) return
      const { data, error } = await supabase.from('feedback').select('*').order('id',{ascending:false}).limit(200)
      if(error) throw error
      setRows((data as any)||[])
    }catch(e:any){ setErr(e?.message||'Failed') }
  }
  React.useEffect(()=>{ load() },[])
  return (<div className="card">
    <div style={{marginBottom:8, display:'flex', justifyContent:'space-between'}}>
      <strong>Feedback</strong>
      <button onClick={load}>Refresh</button>
    </div>
    {err && <div className="bad">{err}</div>}
    <table className="table"><thead><tr><th>ID</th><th>Time</th><th>User</th><th>Subject</th><th>Message</th></tr></thead>
    <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.t? new Date(Number(r.t)).toLocaleString():''}</td><td>{r.user_id?.slice(0,8)||''}</td><td>{r.subject||''}</td><td>{r.message||''}</td></tr>))}</tbody></table>
  </div>)
}
