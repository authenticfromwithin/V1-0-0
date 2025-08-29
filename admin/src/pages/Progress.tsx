import React from 'react'
import { supabase } from '../logic/supabaseClient'
export default function Progress(){
  const [rows,setRows]=React.useState<any[]>([])
  const [err,setErr]=React.useState<string|null>(null)
  async function load(){
    try{
      if(!supabase) return
      const { data, error } = await supabase.from('progress_events').select('*').order('t',{ascending:false}).limit(200)
      if(error) throw error
      setRows(data||[])
    }catch(e:any){ setErr(e?.message||'Failed') }
  }
  React.useEffect(()=>{ load() },[])
  return (<div className="card">
    <div style={{marginBottom:8, display:'flex', justifyContent:'space-between'}}>
      <strong>Progress</strong>
      <button onClick={load}>Refresh</button>
    </div>
    {err && <div className="bad">{err}</div>}
    <table className="table"><thead><tr><th>ID</th><th>User</th><th>Time</th><th>Page</th><th>Intent</th><th>Theme</th><th>Avatar</th></tr></thead>
    <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.user_id?.slice(0,8)}</td><td>{new Date(Number(r.t)).toLocaleString()}</td><td>{r.page}</td><td>{r.intent||''}</td><td>{r.theme||''}</td><td>{r.avatar||''}</td></tr>))}</tbody></table>
  </div>)
}
