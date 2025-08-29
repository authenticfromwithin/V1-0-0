import React from 'react'
import { supabase } from '@/lib/supabase'
type Ev = { t: number; type?: string; user_id?: string | null; data?: any; page?: string; intent?: string; theme?: string; avatar?: string; meta?: any }
type Profile = { user_id: string; display_name?: string; theme?: string; avatar_archetype?: string; updated_at?: string }
type Notif = { id: number; title: string; body?: string; audience?: string; created_at?: string }
type Feedback = { id: number; t: number; subject?: string; message?: string; user_id?: string }
export default function Dashboard() {
  const [tab, setTab] = React.useState<'events'|'progress'|'profiles'|'notifications'|'feedback'>('events')
  const [rows, setRows] = React.useState<any[]>([])
  const [typeFilter, setTypeFilter] = React.useState<string>('')
  const [since, setSince] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  async function load() {
    try {
      setLoading(true); setError(null)
      if (tab === 'events') {
        let q = supabase.from('events').select('*').order('t',{ascending:false}).limit(1000)
        if (typeFilter) q = q.eq('type', typeFilter)
        if (since) { const ms = Date.parse(since); if (!Number.isNaN(ms)) q = q.gte('t', ms) }
        const { data, error } = await q; if (error) throw error; setRows(data||[])
      } else if (tab === 'progress') {
        let q = supabase.from('progress_events').select('*').order('t',{ascending:false}).limit(1000)
        if (typeFilter) q = q.eq('intent', typeFilter)
        if (since) { const ms = Date.parse(since); if (!Number.isNaN(ms)) q = q.gte('t', ms) }
        const { data, error } = await q; if (error) throw error; setRows(data||[])
      } else if (tab === 'profiles') {
        const { data, error } = await supabase.from('profiles_public').select('*').order('updated_at',{ascending:false}).limit(1000)
        if (error) throw error; setRows(data||[])
      } else if (tab === 'notifications') {
        const { data, error } = await supabase.from('notifications_public').select('*').order('id',{ascending:false}).limit(1000)
        if (error) throw error; setRows(data||[])
      } else if (tab === 'feedback') {
        const { data, error } = await supabase.from('feedback').select('*').order('id',{ascending:false}).limit(1000)
        if (error) throw error; setRows(data||[])
      }
    } catch (e: any) { setError(e?.message || 'Failed to load') } finally { setLoading(false) }
  }
  React.useEffect(() => { load() }, [tab])
  return (
    <div className="center" style={{alignItems:'start', paddingTop:24}}>
      <div className="card" style={{width:'min(1200px,96vw)'}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <h2 style={{margin:'6px 0'}}>AFW Admin</h2>
          <div className="row" style={{gap:8}}>
            <button className="btn" onClick={()=>setTab('events')} disabled={tab==='events'}>Events</button>
            <button className="btn" onClick={()=>setTab('progress')} disabled={tab==='progress'}>Progress</button>
            <button className="btn" onClick={()=>setTab('profiles')} disabled={tab==='profiles'}>Profiles</button>
            <button className="btn" onClick={()=>setTab('notifications')} disabled={tab==='notifications'}>Notifications</button>
            <button className="btn" onClick={()=>setTab('feedback')} disabled={tab==='feedback'}>Feedback</button>
            <button className="btn" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</button>
          </div>
        </div>
        <div className="row" style={{margin:'8px 0'}}>
          {(tab==='events' || tab==='progress') && <input placeholder={tab==='events'?'Filter by type':'Filter by intent'} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} />}
          <input type="date" value={since} onChange={e=>setSince(e.target.value)} />
        </div>
        {error && <div className="bad" style={{margin:'8px 0'}}>{error}</div>}
        <div style={{overflowX:'auto', maxHeight:'70vh', overflowY:'auto'}}>
          {tab==='events' && (<table><thead><tr><th>Time</th><th>Type</th><th>User</th><th>Data</th></tr></thead><tbody>{rows.map((r:Ev)=> <tr key={r.t}><td>{new Date(r.t).toISOString()}</td><td>{r.type}</td><td>{r.user_id||'—'}</td><td><pre style={{margin:0}}>{JSON.stringify(r.data||{}, null, 2)}</pre></td></tr>)}</tbody></table>)}
          {tab==='progress' && (<table><thead><tr><th>Time</th><th>User</th><th>Page</th><th>Intent</th><th>Theme</th><th>Avatar</th><th>Meta</th></tr></thead><tbody>{rows.map((r:any)=> <tr key={r.id}><td>{new Date(r.t).toISOString()}</td><td>{r.user_id||'—'}</td><td>{r.page}</td><td>{r.intent||'—'}</td><td>{r.theme||'—'}</td><td>{r.avatar||'—'}</td><td><pre style={{margin:0}}>{JSON.stringify(r.meta||{}, null, 2)}</pre></td></tr>)}</tbody></table>)}
          {tab==='profiles' && (<table><thead><tr><th>User</th><th>Display name</th><th>Theme</th><th>Avatar archetype</th><th>Updated</th></tr></thead><tbody>{rows.map((p:Profile)=> <tr key={p.user_id}><td>{p.user_id}</td><td>{p.display_name||'—'}</td><td>{p.theme||'—'}</td><td>{p.avatar_archetype||'—'}</td><td>{p.updated_at||'—'}</td></tr>)}</tbody></table>)}
          {tab==='notifications' && (<table><thead><tr><th>ID</th><th>Audience</th><th>Title</th><th>Body</th><th>Created</th></tr></thead><tbody>{rows.map((n:Notif)=> <tr key={n.id}><td>{n.id}</td><td>{n.audience||'all'}</td><td>{n.title}</td><td>{n.body||'—'}</td><td>{n.created_at||'—'}</td></tr>)}</tbody></table>)}
          {tab==='feedback' && (<table><thead><tr><th>ID</th><th>Time</th><th>User</th><th>Subject</th><th>Message</th></tr></thead><tbody>{rows.map((f:Feedback)=> <tr key={f.id}><td>{f.id}</td><td>{new Date(f.t).toISOString()}</td><td>{f.user_id||'—'}</td><td>{f.subject||'—'}</td><td>{f.message||'—'}</td></tr>)}</tbody></table>)}
        </div>
      </div>
    </div>
  )
}
