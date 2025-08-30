import React from 'react';
import { getVariant, setVariant } from '@/logic/prefs';

type Props = { rig: 'healing'|'journey'; variants?: string[] };

function useVideoThumb(srcs: string[], width = 160, height = 90){
  const [url, setUrl] = React.useState<string>('');
  React.useEffect(()=>{
    let revoked: string | null = null;
    let canceled = false;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'auto';
    // try each source until one works
    const tryNext = (i: number) => {
      if (i >= srcs.length) return;
      video.src = srcs[i];
      video.addEventListener('error', ()=> tryNext(i+1), { once: true });
      video.addEventListener('loadedmetadata', ()=> {
        try { video.currentTime = Math.min(0.12, (video.duration || 0.5) / 10); } catch {}
      }, { once: true });
      video.addEventListener('seeked', ()=> {
        if (canceled) return;
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx){
          ctx.drawImage(video, 0, 0, width, height);
          canvas.toBlob(b=>{
            if (!b) return;
            const u = URL.createObjectURL(b);
            revoked && URL.revokeObjectURL(revoked);
            revoked = u;
            setUrl(u);
          }, 'image/jpeg', 0.82);
        }
      }, { once: true });
    };
    tryNext(0);
    return ()=>{
      canceled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [srcs.join('|'), width, height]);
  return url;
}

function variantSources(rig: 'healing'|'journey', variant: string){
  const base = `/assets/avatars/${rig}/idle`;
  // prefer variant path, then default
  return [
    `${base}/${variant}/webm/idle.webm`,
    `${base}/webm/idle.webm`,
    `${base}/${variant}/mp4/idle.mp4`,
    `${base}/mp4/idle.mp4`
  ];
}

export default function WardrobeTiles({ rig, variants = ['variant-01','variant-02'] }: Props){
  const [val, setVal] = React.useState<string>(() => getVariant(rig));

  React.useEffect(()=>{
    setVariant(rig, val);
    document.documentElement.setAttribute(`data-${rig}-variant`, val);
  }, [rig, val]);

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(160px, 1fr))', gap:12}}>
      {variants.map(v => {
        const thumb = useVideoThumb(variantSources(rig, v));
        const active = v === val;
        return (
          <button key={v} onClick={()=>setVal(v)} aria-pressed={active}
            style={{position:'relative', border:'1px solid var(--afw-border)', borderRadius:12, overflow:'hidden', padding:0, outline: active ? '2px solid rgba(180,220,255,.8)' : 'none'}}>
            <img src={thumb} alt={`${rig} ${v}`} style={{display:'block', width:'100%', height:'auto'}}/>
            <div style={{position:'absolute', left:8, bottom:8, padding:'4px 8px', borderRadius:8, background:'rgba(0,0,0,.45)', fontSize:12}}>{v.replace('variant-','Set ')}</div>
          </button>
        );
      })}
    </div>
  );
}

