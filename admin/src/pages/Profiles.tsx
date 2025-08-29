import React from 'react'
import { supabase } from '../logic/supabaseClient'
export default function Profiles(){
  const [rows,setRows]=React.useState<any[]>([])
  const [q,setQ]=React.useState('')
  const [err,setErr]=React.useState<string|null>(null)
  async function load(){
    try{
      if(!supabase) return
      const { data, error } = await supabase.from('profiles_public').select('*').order('updated_at',{ascending:false}).limit(200)
      if(error) throw error
      setRows(data||[])
    }catch(e:any){ setErr(e?.message||'Failed') }
  }
  React.useEffect(()=>{ load() },[])
  const filtered = rows.filter(r => !q || (r.display_name||'').toLowerCase().includes(q.toLowerCase()) || (r.theme||'').includes(q))
  return (<div className="card">
    <div className="controls"><input placeholder="Search display name or theme…" value={q} onChange={e=>setQ(e.target.value)} /><button onClick={load}>Refresh</button></div>
    {err && <div className="bad">{err}</div>}
    <table className="table"><thead><tr><th>User</th><th>Display</th><th>Theme</th><th>Avatar</th><th>Updated</th></tr></thead>
    <tbody>{filtered.map(r=>(<tr key={r.user_id}><td>{r.user_id?.slice(0,8)}</td><td>{r.display_name||''}</td><td>{r.theme||''}</td><td>{r.avatar_archetype||''}</td><td>{r.updated_at? new Date(r.updated_at).toLocaleString():''}</td></tr>))}</tbody></table>
  </div>)
}
