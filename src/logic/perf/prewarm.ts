export function prefetchImage(url: string){
  try {
    const l = document.createElement('link');
    l.rel = 'preload'; l.as = 'image'; l.href = url;
    document.head.appendChild(l);
  } catch {}
}
export function prewarmVideoSources(sources: { type: string; src: string }[]){
  try {
    const v = document.createElement('video');
    v.preload = 'auto'; v.muted = true; v.playsInline = true; v.style.display = 'none';
    const s = sources[0]; if (!s) return;
    v.src = s.src; // browser will fetch headers & cache; we avoid play to prevent autoplay policies
    document.body.appendChild(v);
    window.setTimeout(()=>{ try { v.remove(); } catch {} }, 2500);
  } catch {}
}




