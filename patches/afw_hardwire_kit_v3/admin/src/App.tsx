
  import React, { useEffect, useState } from 'react'

  type Ann = { id:string; title:string; message:string; severity:'info'|'warn'|'error'; active:boolean }

  export default function App() {
    const [announcements, setAnnouncements] = useState<Ann[]>([])
    const [msg, setMsg] = useState('')

    useEffect(() => {
      fetch('/content/announcements.json')
        .then(r=>r.json())
        .then(d=>setAnnouncements(d.announcements||[]))
        .catch(()=>setAnnouncements([]))
    }, [])

    const add = () => {
      const next:Ann = { id: `ann-${Date.now()}`, title: 'Note', message: msg, severity:'info', active: true }
      const updated = [next, ...announcements]
      setAnnouncements(updated)
      // export to static file instructions
      alert('In a full build, this would write to /public/content/announcements.json and trigger a site banner. For now, copy below JSON into that file and redeploy.')
      console.log(JSON.stringify({ announcements: updated }, null, 2))
    }

    return (
      <div style={{padding:20, color:'#e9eef2', background:'#0b0f12', minHeight:'100vh'}}>
        <h1>AFW Admin</h1>
        <p>Manages static manifests for the public site. Journals are never accessible here.</p>
        <div style={{display:'flex', gap:8}}>
          <input style={{flex:1, padding:8}} placeholder="Write a banner message..." value={msg} onChange={e=>setMsg(e.target.value)} />
          <button onClick={add}>Add announcement</button>
        </div>
        <pre style={{whiteSpace:'pre-wrap', background:'#11171b', padding:12, marginTop:16, borderRadius:8}}>
{JSON.stringify({ announcements }, null, 2)}
        </pre>
      </div>
    )
  }
