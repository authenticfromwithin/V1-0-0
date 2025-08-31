import React from 'react';
import { getVoices, getOpts, setOpts, speak, stop, pause, resume } from '@/logic/narration/tts';

export default function TTSPlayer({ text }:{ text: string }){
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [opts, setLocalOpts] = React.useState(getOpts());
  const [status, setStatus] = React.useState<'idle'|'speaking'|'paused'>('idle');

  React.useEffect(()=>{
    const load = ()=> setVoices(getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return ()=>{ window.speechSynthesis.onvoiceschanged = null as any; };
  }, []);

  const update = (patch: any) => {
    const next = { ...opts, ...patch };
    setLocalOpts(next);
    setOpts(next);
  };

  const onSpeak = () => { setStatus('speaking'); speak(text, opts, ()=> setStatus('idle')); };
  const onStop  = () => { stop(); setStatus('idle'); };
  const onPause = () => { pause(); setStatus('paused'); };
  const onResume= () => { resume(); setStatus('speaking'); };

  return (
    <div className="afw-card">
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
        <label>Voice
          <select value={opts.voice || ''} onChange={e=>update({voice:e.target.value})} style={{width:'100%', padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>
            <option value="">Default</option>
            {voices.map(v=> <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
        <label>Rate
          <input type="range" min={0.7} max={1.4} step={0.01} value={opts.rate||1} onChange={e=>update({rate:Number(e.target.value)})}/>
        </label>
        <label>Pitch
          <input type="range" min={0.5} max={2} step={0.01} value={opts.pitch||1} onChange={e=>update({pitch:Number(e.target.value)})}/>
        </label>
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={onSpeak} style={{padding:'6px 10px', borderRadius:8}}>Play</button>
        <button onClick={onPause} disabled={status!=='speaking'} style={{padding:'6px 10px', borderRadius:8}}>Pause</button>
        <button onClick={onResume} disabled={status!=='paused'} style={{padding:'6px 10px', borderRadius:8}}>Resume</button>
        <button onClick={onStop} style={{padding:'6px 10px', borderRadius:8}}>Stop</button>
      </div>
    </div>
  );
}





