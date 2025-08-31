import React from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteAnnouncer(){
  const { pathname } = useLocation();
  const [msg, setMsg] = React.useState('');
  React.useEffect(()=>{
    const title = document.title.replace(/\s+\|\s+.*$/, '');
    const name = pathname === '/' ? 'Home' : pathname.replace('/', '').replace(/-/g,' ');
    setMsg(`${title || 'Page'} — ${name} loaded`);
  }, [pathname]);
  return (
    <div aria-live="polite" aria-atomic="true" style={{position:'absolute', width:1, height:1, overflow:'hidden', clip:'rect(1px, 1px, 1px, 1px)'}}>
      {msg}
    </div>
  );
}


