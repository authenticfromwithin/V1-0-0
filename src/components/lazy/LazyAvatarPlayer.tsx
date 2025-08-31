import React from "react";
const Player = React.lazy(() => import("components/AvatarPlayer/Player"));
export default function LazyAvatarPlayer(props:any){
  try{ if(typeof document!=="undefined"){ const p=document.documentElement.getAttribute("data-page"); if(p==="home") return null; } }catch{}
  return (<React.Suspense fallback={null}><Player {...props}/></React.Suspense>);
}