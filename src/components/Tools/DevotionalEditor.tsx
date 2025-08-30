import React from 'react';
import { saveJSON } from '@/logic/tools/file';

type Devo = { id: string; title: string; date: string; passage?: string; body?: string };

function ymd(d: Date){ return d.toISOString().slice(0,10); }
function monthFolder(id: string){ return id.slice(0,7); }

export default function DevotionalEditor(){
  const [date, setDate] = React.useState<string>(ymd(new Date()));
  const [title, setTitle] = React.useState('');
  const [passage, setPassage] = React.useState('');
  const [body, setBody] = React.useState('');

  const exportJson = () => {
    const id = date;
    const out: Devo = { id, title: title || id, date, passage, body };
    const fname = `devotional-${id}.json`;
    saveJSON(fname, out);
  };

  const loadFromFile = (file: File) => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const j = JSON.parse(String(fr.result||'{}'));
        setDate(j.id || j.date || ymd(new Date()));
        setTitle(j.title || '');
        setPassage(j.passage || '');
        setBody(j.body || '');
      } catch {}
    };
    fr.readAsText(file);
  };

  return (
    <section className="afw-card">
      <h3 style={{marginTop:0}}>Devotional Editor</h3>
      <p className="afw-muted">Creates daily JSON files and lets you edit existing ones offline.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <label> Date
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:'100%', padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}/>
        </label>
        <label> Title
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{width:'100%', padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}/>
        </label>
      </div>
      <label> Passage (optional)
        <input value={passage} onChange={e=>setPassage(e.target.value)} placeholder="e.g., Psalm 23" style={{width:'100%', padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}/>
      </label>
      <label> Body (optional)
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write the body..." />
      </label>
      <div style={{display:'flex', gap:8, alignItems:'center', marginTop:8}}>
        <button onClick={exportJson} style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>Export JSON</button>
        <label style={{border:'1px dashed var(--afw-border)', borderRadius:8, padding:'6px 10px', cursor:'pointer'}}>
          Load JSON<input type="file" accept="application/json" onChange={e=>{ const f=e.target.files?.[0]; if (f) loadFromFile(f); }} style={{display:'none'}}/>
        </label>
      </div>
      <p className="afw-muted" style={{marginTop:6}}>
        Place the exported file at <code>/public/content/devotionals/{monthFolder(date)}/devotional-{date}.json</code>.
      </p>
    </section>
  );
}

