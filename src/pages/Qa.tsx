import React from 'react';

type StateSpec = { key: string; label: string; loop: boolean };
const HEALING: StateSpec[] = [
  { key:'idle', label:'Idle', loop:true },
  { key:'walk', label:'Walk', loop:true },
  { key:'sit_pray', label:'Sit Pray', loop:true },
  { key:'stretch', label:'Stretch', loop:false },
  { key:'drink', label:'Drink', loop:false },
  { key:'pick_eat_fruit', label:'Pick/Eat Fruit', loop:false },
];
const JOURNEY: StateSpec[] = [
  { key:'idle', label:'Idle', loop:true },
  { key:'walk', label:'Walk', loop:true },
  { key:'pray', label:'Pray', loop:true },
  { key:'kneel', label:'Kneel', loop:false },
  { key:'read_devotional', label:'Read Devotional', loop:true },
  { key:'reflect', label:'Reflect', loop:false },
];

async function head(url: string){
  try { const r = await fetch(url, { method:'HEAD', cache:'no-store' }); return r.ok; }
  catch { return false; }
}

function useAsync<T>(fn: ()=>Promise<T>, deps: React.DependencyList){
  const [data, setData] = React.useState<T | null>(null);
  const [busy, setBusy] = React.useState(false);
  React.useEffect(()=>{
    let ok = true; setBusy(true);
    fn().then(v => { if (ok) setData(v); }).finally(()=> ok && setBusy(false));
    return ()=>{ ok = false; };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, busy };
}

export default function QA(){
  const [variant, setVariant] = React.useState<'none'|'set-a'|'set-b'>('none');

  const run = React.useCallback(async ()=>{
    const res: any = { healing: {}, journey: {} };
    for (const s of HEALING){
      const base = `/assets/avatars/healing/${s.key}`;
      const vpath = variant === 'none' ? '' : `/${variant}`;
      const w = await head(`${base}${vpath}/webm/${s.key}.webm`);
      const m = await head(`${base}${vpath}/mp4/${s.key}.mp4`);
      const wb = variant !== 'none' ? await head(`${base}/webm/${s.key}.webm`) : false;
      const mb = variant !== 'none' ? await head(`${base}/mp4/${s.key}.mp4`) : false;
      res.healing[s.key] = { webm: w, mp4: m, base_webm: wb, base_mp4: mb };
    }
    for (const s of JOURNEY){
      const base = `/assets/avatars/journey/${s.key}`;
      const w = await head(`${base}/webm/${s.key}.webm`);
      const m = await head(`${base}/mp4/${s.key}.mp4`);
      res.journey[s.key] = { webm: w, mp4: m };
    }
    return res;
  }, [variant]);

  const { data, busy } = useAsync(run, [run]);

  const heal = data?.healing || {};
  const jour = data?.journey || {};

  return (
    <main className="qa page">
      <h2>AFW — Clip Presence Checklist</h2>
      <div className="qa-controls">
        <label>Healing Variant:&nbsp;
          <select value={variant} onChange={e=>setVariant(e.currentTarget.value as any)}>
            <option value="none">Base only</option>
            <option value="set-a">Set A</option>
            <option value="set-b">Set B</option>
          </select>
        </label>
        {busy && <span className="meta">Checking…</span>}
        {!busy && <button onClick={()=>window.location.reload()}>Re-check</button>}
      </div>

      <section>
        <h3>Healing</h3>
        <table className="qa-table">
          <thead><tr><th>State</th><th>WEBM</th><th>MP4</th>{variant!=='none' && <th>Base WEBM</th>}{variant!=='none' && <th>Base MP4</th>}</tr></thead>
          <tbody>
            {HEALING.map(s => {
              const r = heal[s.key] || {};
              return (
                <tr key={s.key}>
                  <td>{s.label}</td>
                  <td className={r.webm ? 'ok' : 'miss'}>{r.webm ? '✓' : '—'}</td>
                  <td className={r.mp4 ? 'ok' : 'miss'}>{r.mp4 ? '✓' : '—'}</td>
                  {variant!=='none' && <td className={r.base_webm ? 'ok' : 'miss'}>{r.base_webm ? '✓' : '—'}</td>}
                  {variant!=='none' && <td className={r.base_mp4 ? 'ok' : 'miss'}>{r.base_mp4 ? '✓' : '—'}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Journey</h3>
        <table className="qa-table">
          <thead><tr><th>State</th><th>WEBM</th><th>MP4</th></tr></thead>
          <tbody>
            {JOURNEY.map(s => {
              const r = jour[s.key] || {};
              return (
                <tr key={s.key}>
                  <td>{s.label}</td>
                  <td className={r.webm ? 'ok' : 'miss'}>{r.webm ? '✓' : '—'}</td>
                  <td className={r.mp4 ? 'ok' : 'miss'}>{r.mp4 ? '✓' : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}


