import React from 'react';
import type { AvatarRig, AvatarClip } from 'types/avatar';
import { getVariant } from '@/logic/prefs';

type Props = {
  rig: AvatarRig;
  state: keyof AvatarRig['clips'];
  crossfadeMs?: number;
};

function buildSources(rigName: string, state: string, clip: AvatarClip){
  const variant = getVariant(rigName as any);
  // default pattern: /assets/avatars/<rig>/<state>/{webm|mp4}/<state>.<ext>
  const base = `/assets/avatars/${rigName}/${state}`;
  const webmV = { type: 'video/webm; codecs=vp9', src: `${base}/${variant}/webm/${state}.webm` };
  const webmD = { type: 'video/webm; codecs=vp9', src: `${base}/webm/${state}.webm` };
  const mp4V  = { type: 'video/mp4; codecs=avc1.42E01E', src: `${base}/${variant}/mp4/${state}.mp4` };
  const mp4D  = { type: 'video/mp4; codecs=avc1.42E01E', src: `${base}/mp4/${state}.mp4` };
  // Try variant first, then default. Browsers will fall back if a <source> 404s.
  return rigName === 'journey' || rigName === 'healing' ? [webmV, webmD, mp4V, mp4D] : clip.sources;
}

function sourcesToChildren(srcs: {type:string, src:string}[]){
  return srcs.map((s, i) => <source key={i} src={s.src} type={s.type}/>);
}

export default function Player({ rig, state, crossfadeMs = 800 }: Props){
  const [aOnTop, setAOnTop] = React.useState(true);
  const [ready, setReady] = React.useState(false);
  const videoA = React.useRef<HTMLVideoElement>(null);
  const videoB = React.useRef<HTMLVideoElement>(null);

  const playClip = async (el: HTMLVideoElement | null, clip: AvatarClip | undefined, loop = true) => {
    if (!el || !clip) return;
    el.pause();
    el.innerHTML = '';
    const srcs = buildSources(rig.name, clip.label, clip);
    sourcesToChildren(srcs).forEach(node => el.appendChild(node as any));
    el.loop = !!clip.loop && loop;
    el.muted = true; // muted autoplay allowed
    el.playsInline = true;
    try { await el.play(); } catch {}
  };

  // prewarm idle on mount
  React.useEffect(()=>{
    const idle = rig.clips['idle'];
    playClip(videoA.current, idle, true).then(()=> setReady(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rig.name]);

  // on state change: prepare hidden video, play, crossfade, then swap
  React.useEffect(()=>{
    if (!ready) return;
    const nextClip = (rig.clips[state as string] || rig.clips['idle']);
    const [top, bottom] = (aOnTop ? [videoA.current, videoB.current] : [videoB.current, videoA.current]);

    playClip(bottom, nextClip, true).then(()=>{
      if (top) top.style.transition = `opacity ${crossfadeMs}ms ease`;
      if (bottom) bottom.style.transition = `opacity ${crossfadeMs}ms ease`;
      if (top) top.style.opacity = '0';
      if (bottom) bottom.style.opacity = '1';
      setTimeout(()=> setAOnTop(!aOnTop), crossfadeMs + 20);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, ready]);

  const baseStyle: React.CSSProperties = {
    position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0, filter:'contrast(1.02) saturate(1.02)'
  };

  return (
    <div aria-label={`${rig.name} avatar`} role="figure" style={{position:'relative', width:'100%', height:'100%', background:'#000'}}>
      <video ref={videoA} style={{...baseStyle, opacity: aOnTop ? 1 : 0}} />
      <video ref={videoB} style={{...baseStyle, opacity: aOnTop ? 0 : 1}} />
    </div>
  );
}





