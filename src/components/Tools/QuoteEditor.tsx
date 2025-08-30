import React from 'react';
import { saveJSON } from '@/logic/tools/file';

type Quote = { text: string; author?: string };

export default function QuoteEditor(){
  const [category, setCategory] = React.useState('faith');
  const [text, setText] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [items, setItems] = React.useState<Quote[]>([]);

  const add = () => {
    if (!text.trim()) return;
    setItems([...items, { text: text.trim(), author: author.trim() || undefined }]);
    setText(''); setAuthor('');
  };
  const remove = (i:number) => setItems(items.filter((_,idx)=>idx!==i));

  const exportJson = () => {
    const fname = `${category}.json`;
    saveJSON(fname, items);
  };

  const loadFromFile = (file: File) => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const arr = JSON.parse(String(fr.result||'[]'));
        if (Array.isArray(arr)) setItems(arr as Quote[]);
      } catch {}
    };
    fr.readAsText(file);
  };

  return (
    <section className="afw-card">
      <h3 style={{marginTop:0}}>Quote Category Editor</h3>
      <p className="afw-muted">Manage a single quotes category JSON offline.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <label> Category
          <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="e.g., faith, hope, identity" style={{width:'100%', padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}/>
        </label>
        <div />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr auto', gap:8, alignItems:'center'}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Quote text" style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}/>
        <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author (optional)" style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}/>
        <button onClick={add} style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>Add</button>
      </div>
      <ul className="list" style={{marginTop:10}}>
        {items.map((q,i)=> (
          <li key={i} className="afw-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div><strong>{q.text}</strong>{q.author ? <span className="afw-muted"> — {q.author}</span> : null}</div>
            <button onClick={()=>remove(i)} style={{padding:'4px 8px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>Remove</button>
          </li>
        ))}
      </ul>
      <div style={{display:'flex', gap:8, alignItems:'center', marginTop:8}}>
        <button onClick={exportJson} style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>Export JSON</button>
        <label style={{border:'1px dashed var(--afw-border)', borderRadius:8, padding:'6px 10px', cursor:'pointer'}}>
          Load JSON<input type="file" accept="application/json" onChange={e=>{ const f=e.target.files?.[0]; if (f) loadFromFile(f); }} style={{display:'none'}}/>
        </label>
      </div>
      <p className="afw-muted" style={{marginTop:6}}>
        Place the exported file at <code>/public/content/quotes/{category}.json</code>. Update <code>quotes.manifest.json</code> categories if needed.
      </p>
    </section>
  );
}

