import React from 'react';
import { getMixer } from 'logic/audio/mixer';
import { getPref, setPref } from 'logic/prefs';

export default function MasterVolume(){
  const [v, setV] = React.useState<number>(() => getPref('afw:sound:master', 0.6));
  React.useEffect(()=>{ getMixer().setMaster(v); setPref('afw:sound:master', v); }, [v]);
  return (
    <label style={{display:'inline-flex', alignItems:'center', gap:8}}>
      <span style={{opacity:.8, fontSize:12}}>Sound</span>
      <input type="range" min={0} max={1} step={0.01} value={v} onChange={e=>setV(Number(e.currentTarget.value))}/>
    </label>
  );
}
