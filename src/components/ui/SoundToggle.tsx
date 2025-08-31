import React from 'react';
import { getMixer, type ThemeName } from '@/logic/audio/mixer';

export default function SoundToggle(){
  const [muted, setMuted] = React.useState(()=> localStorage.getItem('afw:sound:muted') === '1');
  const mixer = React.useMemo(()=>getMixer(),[]);
  React.useEffect(()=>{
    const theme = (document.documentElement.getAttribute('data-theme') || '') as ThemeName;
    mixer.loadTheme(theme);
    mixer.setMaster(muted ? 0 : 0.6);
  }, [muted, mixer]);

  const toggle = () => {
    const m = !muted;
    setMuted(m);
    localStorage.setItem('afw:sound:muted', m ? '1' : '0');
  };
  return (
    <button onClick={toggle} aria-pressed={muted} title={muted? 'Unmute atmos' : 'Mute atmos'}
      style={{padding:'6px 10px', borderRadius:8}}>
      {muted ? 'Sound Off' : 'Sound On'}
    </button>
  );
}



