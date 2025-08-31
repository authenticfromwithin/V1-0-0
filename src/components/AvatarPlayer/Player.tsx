import React from "react";
import type { AvatarRig, AvatarClip } from "types/avatar";
type Props={rig:AvatarRig;state:keyof AvatarRig["clips"];className?:string;variant?:string;};
function buildSources(rigName:string,state:string,clip:AvatarClip,variant?:string){
  const base=`/assets/avatars/${rigName}/${state}`;
  const webmV={type:'video/webm; codecs=vp9',src:`${base}/${variant}/webm/${state}.webm`};
  const webmD={type:'video/webm; codecs=vp9',src:`${base}/webm/${state}.webm`};
  const mp4V={type:'video/mp4; codecs=avc1.42E01E',src:`${base}/${variant}/mp4/${state}.mp4`};
  const mp4D={type:'video/mp4; codecs=avc1.42E01E',src:`${base}/mp4/${state}.mp4`};
  return rigName==='journey'||rigName==='healing'?[webmV,webmD,mp4V,mp4D]:clip.sources;
}
export default function Player({rig,state,className="",variant}:Props){
  try{ if(typeof document!=="undefined"){ const p=document.documentElement.getAttribute("data-page"); if(p==="home") return null; } }catch{}
  const clip=rig.clips[state as string]; const sources=buildSources(rig.name,String(state),clip,variant);
  return (<div aria-label={`${rig.name} avatar`} role="figure" className={["avatar-player",className].filter(Boolean).join(" ")} data-avatar style={{position:"relative",width:"100%",height:"100%",background:"#000"}}>
    <video data-avatar className="w-full h-full object-cover" autoPlay muted playsInline loop preload="auto">
      {sources.map((s,i)=>(<source key={i} src={s.src} type={s.type} data-avatar/>))}
    </video>
  </div>);
}