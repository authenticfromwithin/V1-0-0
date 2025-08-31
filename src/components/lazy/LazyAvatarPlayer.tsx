import React from 'react';
const Player = React.lazy(() => import('components/AvatarPlayer/Player'));
export default function LazyAvatarPlayer(props: any){
  return (
    <React.Suspense fallback={<div style={{height:'100%', display:'grid', placeItems:'center', opacity:.7}}>Loading…</div>}>
      <Player {...props}/>
    </React.Suspense>
  );
}




