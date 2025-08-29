import React from 'react';

type Props = { text: string };

export default function TTSReader({ text }: Props){
  const [speaking, setSpeaking] = React.useState(false);
  const synth = (typeof window !== 'undefined' ? window.speechSynthesis : null);

  const speak = () => {
    if (!synth) return;
    if (speaking){ synth.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };

  React.useEffect(()=>(){ return () => { try{ synth?.cancel(); }catch{} } }, [synth]);

  return (
    <div style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
      <strong>Browser Narration</strong>
      <p style={{opacity:.8, margin:'6px 0 10px'}}>Uses your device's voice. No audio is downloaded.</p>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <button onClick={speak} style={{padding:'6px 10px', borderRadius:8}}>
          {speaking? 'Stop' : 'Play'}
        </button>
        {!synth && <span style={{color:'#f99'}}>Speech synthesis not supported on this device.</span>}
      </div>
    </div>
  );
}
