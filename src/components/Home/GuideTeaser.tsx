import React from 'react';
import { Link } from 'react-router-dom';

type Section = { id: string; title: string; };
type GuideManifest = { sections: Section[] } | Section[];

export default function GuideTeaser(){
  const [title, setTitle] = React.useState<string | null>(null);
  React.useEffect(()=>{
    let ok = true;
    fetch('/content/guide.manifest.json', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : null)
      .then((data: GuideManifest | null) => {
        if (!ok || !data) return;
        const sections = Array.isArray(data) ? data : data.sections;
        if (sections && sections.length) setTitle(sections[0].title || null);
      })
      .catch(()=>{});
    return ()=>{ ok = false; };
  }, []);

  return (
    <aside style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12, marginTop:16}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
        <div>
          <strong>Guide</strong>
          <div style={{opacity:.8, fontSize:13}}>{title ? title : 'Read the practice overview'}</div>
        </div>
        <Link to="/guide" style={{textDecoration:'none', padding:'8px 12px', border:'1px solid rgba(255,255,255,.15)', borderRadius:10}}>Open</Link>
      </div>
    </aside>
  );
}




