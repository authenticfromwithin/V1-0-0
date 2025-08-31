import React from 'react';
import { getVariant, setVariant } from '@/logic/prefs';

type GridState = { key: string; label: string };
type Props = {
  rig: 'healing'|'journey';
  states: GridState[];
  variants?: string[];
  onSelect: (stateKey: string) => void;
};

function buildSources(rig: 'healing'|'journey', state: string, variant: string){
  const base = `/assets/avatars/${rig}/${state}`;
  return [
    `${base}/${variant}/webm/${state}.webm`,
    `${base}/webm/${state}.webm`,
    `${base}/${variant}/mp4/${state}.mp4`,
    `${base}/mp4/${state}.mp4`
  ];
}

function useVideoThumb(paths: string[], width = 160, height = 90){
  const [url, setUrl] = React.useState<string>('');
  const [failed, setFailed] = React.useState<boolean>(false);
  React.useEffect(()=>{
    let canceled = false;
    let revoke: string | null = null;
    const el = document.createElement('video');
    el.crossOrigin = 'anonymous';
    el.muted = true;
    el.preload = 'auto';
    const tryNext = (i: number) => {
      if (i >= paths.length){ setFailed(true); return; }
      el.src = paths[i];
      el.onerror = () => tryNext(i+1);
      el.onloadedmetadata = () => {
        try { el.currentTime = Math.min(0.12, (el.duration||0.6)/10); } catch {}
      };
      el.onseeked = () => {
        if (canceled) return;
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx){ setFailed(true); return; }
        ctx.drawImage(el, 0, 0, width, height);
        canvas.toBlob(b=>{
          if (!b){ setFailed(true); return; }
          const u = URL.createObjectURL(b);
          if (revoke) URL.revokeObjectURL(revoke);
          revoke = u;
          setUrl(u);
        }, 'image/jpeg', 0.82);
      };
    };
    tryNext(0);
    return ()=>{ canceled = true; if (revoke) URL.revokeObjectURL(revoke); };
  }, [paths.join('|'), width, height]);
  return { url, failed };
}

export default function PerStateVariantGrid({ rig, states, variants = ['variant-01','variant-02'], onSelect }: Props){
  const [currentVariant, setCurrentVariant] = React.useState<string>(()=> getVariant(rig));

  const choose = (variant: string, stateKey: string) => {
    setCurrentVariant(variant);
    setVariant(rig, variant);
    document.documentElement.setAttribute(`data-${rig}-variant`, variant);
    onSelect(stateKey);
  };

  const cell = (variant: string, st: GridState) => {
    const { url, failed } = useVideoThumb(buildSources(rig, st.key, variant), 156, 88);
    const active = currentVariant === variant;
    const commonStyle: React.CSSProperties = {
      border:'1px solid var(--afw-border)', borderRadius:10, overflow:'hidden', padding:0, minHeight:92,
      position:'relative', display:'block', width:'100%', background:'rgba(0,0,0,.35)'
    };
    if (failed){
      return (
        <div key={variant} style={{...commonStyle, opacity:.6}} aria-disabled="true">
          <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', fontSize:12, opacity:.8}}>missing</div>
        </div>
      );
    }
    return (
      <button key={variant} onClick={()=>choose(variant, st.key)} aria-pressed={active}
        style={{...commonStyle, outline: active ? '2px solid rgba(180,220,255,.8)' : 'none'}}>
        {url && <img src={url} alt={`${st.label} — ${variant}`} style={{display:'block', width:'100%', height:'auto'}}/>}
        <div style={{position:'absolute', left:6, bottom:6, padding:'3px 6px', borderRadius:6, background:'rgba(0,0,0,.45)', fontSize:12}}>{variant.replace('variant-','Set ')}</div>
      </button>
    );
  };

  return (
    <div role="grid" aria-label={`${rig} states × variants`} style={{display:'grid', gridTemplateColumns:`160px repeat(${variants.length}, minmax(160px,1fr))`, gap:10}}>
      {/* header row */}
      <div />
      {variants.map(v => <div key={'h-'+v} style={{fontSize:12, opacity:.85, padding:'4px 2px'}}>{v.replace('variant-','Set ')}</div>)}
      {/* rows */}
      {states.map(st => (
        <React.Fragment key={st.key}>
          <div style={{display:'flex', alignItems:'center', fontSize:12, opacity:.9}}>{st.label}</div>
          {variants.map(v => cell(v, st))}
        </React.Fragment>
      ))}
    </div>
  );
}





