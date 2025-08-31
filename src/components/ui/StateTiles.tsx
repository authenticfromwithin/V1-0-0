import React from 'react';
import { getVariant } from '@/logic/prefs';

type Props = {
  rig: 'healing'|'journey';
  states: { key: string; label: string }[];  // state key maps to folder clip name
  onSelect: (stateKey: string) => void;
};

function useVideoThumb(paths: string[], width = 160, height = 90){
  const [url, setUrl] = React.useState<string>('');
  React.useEffect(()=>{
    let canceled = false;
    let revoke: string | null = null;
    const el = document.createElement('video');
    el.crossOrigin = 'anonymous';
    el.muted = true;
    el.preload = 'auto';
    const tryNext = (i: number) => {
      if (i >= paths.length) return;
      el.src = paths[i];
      el.onerror = () => tryNext(i+1);
      el.onloadedmetadata = () => {
        try { el.currentTime = Math.min(0.12, (el.duration||0.5)/10); } catch {}
      };
      el.onseeked = () => {
        if (canceled) return;
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(el, 0, 0, width, height);
        canvas.toBlob(b=>{
          if (!b) return;
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
  return url;
}

function buildSources(rig: 'healing'|'journey', state: string){
  const variant = getVariant(rig);
  const base = `/assets/avatars/${rig}/${state}`;
  return [
    `${base}/${variant}/webm/${state}.webm`,
    `${base}/webm/${state}.webm`,
    `${base}/${variant}/mp4/${state}.mp4`,
    `${base}/mp4/${state}.mp4`
  ];
}

export default function StateTiles({ rig, states, onSelect }: Props){
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:10}}>
      {states.map(s => {
        const thumb = useVideoThumb(buildSources(rig, s.key));
        return (
          <button key={s.key} onClick={()=>onSelect(s.key)} title={s.label}
            style={{position:'relative', border:'1px solid var(--afw-border)', borderRadius:10, overflow:'hidden', padding:0}}>
            <img src={thumb} alt={`${rig} ${s.label}`} style={{display:'block', width:'100%', height:'auto'}} />
            <div style={{position:'absolute', left:6, bottom:6, padding:'3px 6px', borderRadius:6, background:'rgba(0,0,0,.45)', fontSize:12}}>{s.label}</div>
          </button>
        );
      })}
    </div>
  );
}



