import React from 'react';
import { getActiveProfileData } from '@/logic/auth/store';

function speak(text: string, rate=1, pitch=1, voiceURI?: string){
  const s = new SpeechSynthesisUtterance(text);
  s.rate = rate; s.pitch = pitch;
  if (voiceURI){
    const v = speechSynthesis.getVoices().find(v => v.voiceURI === voiceURI);
    if (v) s.voice = v;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(s);
  return s;
}

export default function TTSNarration({ id, title }:{ id:string; title:string }){
  const [busy, setBusy] = React.useState(false);
  const prefs = getActiveProfileData()?.preferences.tts;
  const play = async () => {
    setBusy(true);
    try{
      const [y,m,d] = id.split('-');
      const url = `/content/devotionals/${y}-${m}/devotional-${id}.json`;
      let text = title;
      try{
        const j = await fetch(url).then(r=>r.ok?r.json():null);
        if (j && j.body){ text = `${j.title || title}. ${j.body}`; }
      }catch{}
      const u = speak(text, prefs?.rate ?? 0.96, prefs?.pitch ?? 0.98, prefs?.voiceURI);
      u.onend = () => setBusy(false);
    }finally{
      // if it errors, we still clear busy after a moment
      setTimeout(()=>setBusy(false), 200);
    }
  };
  const stop = () => { speechSynthesis.cancel(); setBusy(false); };

  return (
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <button onClick={busy? stop : play} style={{padding:'6px 10px', borderRadius:8}}>
        {busy? 'Stop' : 'Speak'}
      </button>
      <span style={{opacity:.75, fontSize:12}}>Uses your device voice — private & offline.</span>
    </div>
  );
}

