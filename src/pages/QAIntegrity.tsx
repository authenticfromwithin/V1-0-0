import React from 'react';
import { runAll } from '@/logic/verify/manifestValidator';

export default function QAIntegrity(){
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  React.useEffect(()=>{
    setBusy(true);
    runAll().then(setResult).finally(()=>setBusy(false));
  },[]);
  return (
    <main className="page">
      <h2>QA Integrity Report</h2>
      {busy && <p>Checking…</p>}
      {!busy && result && (
        <div style={{display:'grid', gap:12}}>
          {result.sections.map((sec:any) => (
            <section key={sec.name} style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
              <h3 style={{marginTop:0}}>{sec.name}</h3>
              <ul className="list">
                {sec.checks.map((c:any, i:number) => (
                  <li key={i} style={{color: c.ok? 'inherit':'#f99'}}>
                    {c.ok ? '✓' : '✕'} {c.id} {c.note? `— ${c.note}`: ''}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

