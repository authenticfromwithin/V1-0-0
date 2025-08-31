
import React from 'react';
import { getMixer, type ThemeName } from '@/logic/audio/mixer';

export default function AudioControls(){
  const [, bump] = React.useState(0);
  const mixer = React.useMemo(()=>getMixer(),[]);
  const theme = (document.documentElement.getAttribute('data-theme') || '') as ThemeName;

  React.useEffect(()=>{
    // Auto-load theme and apply persisted volumes on mount
    mixer.loadTheme(theme).then(()=>bump(x=>x+1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const set = (n: 'wind'|'water'|'leaves'|'birds'|'pad') => (e: React.ChangeEvent<HTMLInputElement>) => {
    mixer.setVolume(n, Number(e.currentTarget.value));
    bump(x=>x+1);
  };

  return (
    <section style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
      <div style={{display:'flex', gap:8, alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
        <strong>Atmos</strong>
        <div style={{display:'flex', gap:8}}>
          <button onClick={()=>mixer.loadTheme(theme)} style={{padding:'6px 10px', borderRadius:8}}>Refresh</button>
          <button onClick={()=>{ mixer.resetToDefaults(); bump(x=>x+1); }} style={{padding:'6px 10px', borderRadius:8}}>Reset</button>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        {(['wind','water','leaves','birds','pad'] as const).map(n=> (
          <label key={n} style={{display:'flex', gap:8, alignItems:'center'}}>
            <span style={{width:80, opacity:.85}}>{n}</span>
            <input type="range" min={0} max={1} step={0.01}
              defaultValue={(mixer as any).stems.get(n)?.gain.gain.value ?? 0}
              onChange={set(n)}/>
          </label>
        ))}
      </div>
      <div style={{marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        <label style={{display:'flex', gap:8, alignItems:'center'}}>
          <span style={{width:80, opacity:.85}}>Master</span>
          <input type="range" min={0} max={1} step={0.01}
            defaultValue={(mixer as any).master?.gain.value ?? 0.6}
            onChange={(e)=>{ mixer.setMaster(Number(e.currentTarget.value)); bump(x=>x+1); }}/>
        </label>
        <label style={{display:'flex', gap:8, alignItems:'center'}}>
          <span style={{width:80, opacity:.85}}>Mood</span>
          <input type="range" min={-1} max={1} step={0.01} defaultValue={0}
            onChange={(e)=>{ mixer.setMood(Number(e.currentTarget.value)); bump(x=>x+1); }}/>
        </label>
      </div>
    </section>
  );
}



