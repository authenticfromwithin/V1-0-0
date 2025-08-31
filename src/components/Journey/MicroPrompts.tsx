import React from 'react';
import { getMixer } from '@/logic/audio/mixer';
import { awardDove } from 'components/DovesCounter/Counter';

type Props = { state: 'idle'|'walk'|'sit_pray'|'stretch'|'drink'|'pick_eat_fruit' };

const CUES: Record<Props['state'], string[]> = {
  idle: ['Soften shoulders.', 'Unclench the jaw.'],
  walk: ['Let arms swing.', 'Unfold the breath.'],
  sit_pray: ['Let words fall quiet.', 'Notice the space between breaths.'],
  stretch: ['Relax the neck.', 'Breathe into the ribs.'],
  drink: ['Savor this pause.', 'One more gentle sip.'],
  pick_eat_fruit: ['Knees soft.', 'Rise with breath.']
};

export default function JourneyMicroPrompts({ state }: Props){
  const [visible, setVisible] = React.useState(false);
  const [prompt, setPrompt] = React.useState<string>('');

  React.useEffect(()=>{
    let alive = true;
    const id = setTimeout(()=>{
      if (!alive) return;
      const arr = CUES[state] || [];
      if (arr.length){
        setPrompt(arr[Math.floor(Math.random()*arr.length)]);
        setVisible(true);
        getMixer().duck(900, -6);
      }
    }, 65000); // gentle cadence ~65s
    return ()=> { alive = false; clearTimeout(id); };
  }, [state]);

  if (!visible) return null;
  return (
    <div role="status" style={{position:'fixed', right:16, bottom:16, zIndex:70, maxWidth:360,
      border:'1px solid rgba(255,255,255,.15)', borderRadius:12, background:'rgba(10,12,16,.9)', backdropFilter:'blur(8px)', padding:12}}>
      <div style={{fontSize:14, marginBottom:8, opacity:.9}}>{prompt}</div>
      <div style={{display:'flex', gap:8}}>
        <button onClick={()=> setVisible(false)} style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>Dismiss</button>
        <button onClick={()=> { awardDove(1); setVisible(false); }} style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>I did this</button>
      </div>
    </div>
  );
}





