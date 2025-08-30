import React from 'react';
import { fetchAnnouncements, markSeen, getSeen, type Announcement } from '@/logic/announcements/store';

export default function AnnouncementBar(){
  const [item, setItem] = React.useState<Announcement|null>(null);

  React.useEffect(()=>{
    let alive = true;
    const load = async () => {
      const a = await fetchAnnouncements();
      const seen = getSeen();
      const firstUnseen = a.find(x => !seen[x.id]) || a[a.length-1];
      if (alive) setItem(firstUnseen || null);
    };
    load();
    const id = setInterval(load, 120_000);
    return ()=> { alive = false; clearInterval(id); };
  }, []);

  if (!item) return null;
  return (
    <aside role="status" style={{position:'sticky', top:0, zIndex:45, padding:'6px 10px',
      background:'rgba(12,14,18,.75)', borderBottom:'1px solid rgba(255,255,255,.08)', backdropFilter:'blur(8px)'}}>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <span aria-hidden>🔔</span>
        <div style={{flex:1}}>
          <strong style={{marginRight:6}}>{item.title}</strong>
          {item.body && <span style={{opacity:.9}}>{item.body}</span>}
        </div>
        <button onClick={()=>markSeen(item.id)} className="nav-icon-btn" aria-label="Dismiss">Dismiss</button>
      </div>
    </aside>
  );
}

