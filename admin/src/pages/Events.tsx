import React from 'react'
import { supabase } from '../logic/supabaseClient'
export default function Events(){
  const [rows,setRows]=React.useState<any[]>([])
  const [err,setErr]=React.useState<string|null>(null)
  async function load(){
    try{
      if(!supabase) return
      const { data, error } = await supabase.from('events').select('*').order('t',{ascending:false}).limit(200)
      if(error) throw error
      setRows(data||[])
    }catch(e:any){ setErr(e?.message||'Failed') }
  }
  React.useEffect(()=>{ load() },[])
  return (<div className="card">
    <div style={{marginBottom:8, display:'flex', justifyContent:'space-between'}}>
      <strong>Events</strong>
      <button onClick={load}>Refresh</button>
    </div>
    {err && <div className="bad">{err}</div>}
    <table className="table"><thead><tr><th>Time</th><th>Type</th><th>User</th><th>Data</th></tr></thead>
    <tbody>{rows.map(r=>(<tr key={r.t}><td>{new Date(Number(r.t)).toLocaleString()}</td><td>{r.type}</td><td>{r.user_id?.slice(0,8)}</td><td><code>{JSON.stringify(r.data)}</code></td></tr>))}</tbody></table>
  </div>)
}
