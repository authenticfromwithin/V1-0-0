import React from 'react';

type Method = { id: string; title: string; url?: string; description?: string };

export default function Donate(){
  const [methods, setMethods] = React.useState<Method[]>([]);

  React.useEffect(()=>{
    let alive = true;
    fetch('/content/donate.links.json', { cache:'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(j => { if (alive) setMethods(Array.isArray(j)? j : []); })
      .catch(()=>{ if (alive) setMethods([]); });
    return ()=>{ alive = false; };
  }, []);

  return (
    <main className="page">
      <h2>Support This Sanctuary</h2>
      {methods.length === 0 ? (
        <div style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
          <p style={{opacity:.9}}>
            No donation methods are configured yet. Add entries to <code>/public/content/donate.links.json</code> with
            titles and secure links (Stripe Payment Link, PayPal, or your bank instructions page).
          </p>
          <p style={{opacity:.8}}>Once added, they’ll appear here instantly on deploy.</p>
        </div>
      ) : (
        <ul className="list" style={{display:'grid', gap:12}}>
          {methods.map(m => (
            <li key={m.id} style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
              <h3 style={{marginTop:0}}>{m.title}</h3>
              {m.description && <p style={{opacity:.9}}>{m.description}</p>}
              {m.url && <a href={m.url} target="_blank" rel="noreferrer" style={{display:'inline-block', padding:'8px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,.15)'}}>Open</a>}
            </li>
          ))}
        </ul>
      )}
      <p style={{opacity:.75, fontSize:12, marginTop:12}}>Donations are optional. Thank you for supporting healing spaces.</p>
    </main>
  );
}


