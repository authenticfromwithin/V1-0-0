import React from 'react';
import { fetchAnnouncements, unseenCount, markSeen, type Announcement } from '@/logic/announcements/store';

export default function NotificationBell(){
  const [items, setItems] = React.useState<Announcement[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(()=>{
    let alive = true;
    const load = async () => {
      const a = await fetchAnnouncements();
      if (alive) setItems(a);
    };
    load();
    const id = setInterval(load, 60_000); // refresh every minute
    return ()=> { alive = false; clearInterval(id); };
  }, []);

  const unseen = unseenCount(items);

  return (
    <div style={{position:'relative'}}>
      <button className="nav-icon-btn" aria-label="Announcements" onClick={()=>setOpen(o=>!o)}>
        🔔{unseen>0 && <span className="badge" style={{marginLeft:6}}>{unseen}</span>}
      </button>
      {open && (
        <div role="menu" style={{position:'absolute', right:0, top:'110%', width:320, maxHeight:360, overflow:'auto',
          border:'1px solid rgba(255,255,255,.12)', borderRadius:10, background:'rgba(10,12,16,.96)', backdropFilter:'blur(8px)', padding:10, zIndex:60}}>
          <strong style={{display:'block', marginBottom:6}}>Announcements</strong>
          {items.length===0 && <div style={{opacity:.8}}>No announcements.</div>}
          <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:8}}>
            {items.map(a => (
              <li key={a.id} style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:8}}>
                <div style={{display:'flex', justifyContent:'space-between', gap:8}}>
                  <div style={{fontWeight:600}}>{a.title}</div>
                  <button onClick={()=>markSeen(a.id)} title="Mark as read" className="nav-icon-btn" aria-label="Mark as read">✓</button>
                </div>
                {a.body && <p style={{margin:'6px 0', opacity:.9}}>{a.body}</p>}
                {a.url && <a href={a.url} target="_blank" rel="noreferrer" style={{fontSize:12, opacity:.85}}>Open</a>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}



