import React from 'react';

type Props = { mode: 'reflect'|'move'|'pray'; intervalMs?: number };

const LINES: Record<Props['mode'], string[]> = {
  reflect: [
    'You are safe in this moment.',
    'Let your breath be unhurried.',
    'Notice the quiet between thoughts.'
  ],
  move: [
    'Let motion loosen what’s tight.',
    'Small movements count.',
    'Your body knows the way.'
  ],
  pray: [
    'Rest the weight you carry.',
    'Speak softly; listen gently.',
    'Presence meets you here.'
  ]
};

export default function MicroAffirmations({ mode, intervalMs = 20000 }: Props){
  const [i, setI] = React.useState(0);
  React.useEffect(()=>{
    let id = setInterval(()=> setI(x => (x+1) % LINES[mode].length), intervalMs);
    return ()=> clearInterval(id);
  }, [mode, intervalMs]);
  return (
    <div aria-live="polite" style={{marginTop:8, fontSize:14, opacity:.85}}>
      {LINES[mode][i]}
    </div>
  );
}
