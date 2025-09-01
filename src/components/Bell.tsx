import React, { useEffect, useState } from "react"
export function Bell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<{id:string; title:string; message:string}[]>([])
  useEffect(() => {
    fetch("/content/announcements.json").then(r=>r.json()).then(d=>{
      setItems(d.announcements || [])
    }).catch(()=>{})
  }, [])
  return (
    <div className="bell-wrap">
      <button className="btn ghost" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>🔔</button>
      {open && (
        <div className="dropdown">
          {items.length===0 ? <div className="drop-item">No announcements</div> :
            items.map(a => <div key={a.id} className="drop-item"><strong>{a.title}</strong><div>{a.message}</div></div>)
          }
        </div>
      )}
    </div>
  )
}
