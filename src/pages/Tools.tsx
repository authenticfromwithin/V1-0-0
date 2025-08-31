import React from 'react';
import { runAll } from '@/logic/verify/manifestValidator';

export default function Tools(){
  const [busy, setBusy] = React.useState(false);
  const [report, setReport] = React.useState<any>(null);
  const run = async () => {
    setBusy(true);
    try{
      const r = await runAll();
      setReport(r);
    } finally { setBusy(false); }
  };
  const download = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'afw-manifest-report.json'; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <main className="page">
      <h2>Admin Tools — Content Validation</h2>
      <p style={{opacity:.9}}>Runs client-side checks for devotionals, quotes, scenes, and avatar clip availability. No data leaves the browser.</p>
      <div style={{display:'flex', gap:8}}>
        <button onClick={run} disabled={busy} style={{padding:'6px 10px', borderRadius:8}}>{busy?'Running…':'Run All Checks'}</button>
        <button onClick={download} disabled={!report} style={{padding:'6px 10px', borderRadius:8}}>Download Report</button>
      </div>
      {report && (
        <div style={{marginTop:12, display:'grid', gap:10}}>
          {report.sections.map((sec:any) => (
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





