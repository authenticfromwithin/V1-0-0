import React from 'react';
import { getMixer } from '@/logic/audio/mixer';
import { awardDove } from 'components/DovesCounter/Counter';

type Props = { hydrationOn: boolean; mode: 'reflect'|'move'|'pray' };

const CUES: Record<Props['mode'], string[]> = {
  reflect: ['Unclench the jaw.', 'Soften the gaze.', 'Relax the shoulders.'],
  move: ['Loosen the neck.', 'Unroll the spine.', 'Breathe into the ribs.'],
  pray: ['Quiet the breath.', 'Let thoughts pass.', 'Rest the hands.']
};

export default function MicroPrompts({ hydrationOn, mode }: Props){
  const [prompt, setPrompt] = React.useState<string>('');
  const [visible, setVisible] = React.useState(false);

  React.useEffect(()=>{
    let alive = true;
    let hydrationTimer: any;
    let cueTimer: any;

    const scheduleHydration = () => {
      clearTimeout(hydrationTimer);
      if (!hydrationOn) return;
      hydrationTimer = setTimeout(()=> { if(!alive) return; show('Take a gentle sip of water.'); }, 3 * 60 * 1000);
    };

    const scheduleCue = () => {
      clearTimeout(cueTimer);
      cueTimer = setTimeout(()=> {
        if(!alive) return;
        const arr = CUES[mode] || [];
        if (arr.length) show(arr[Math.floor(Math.random()*arr.length)]);
      }, 60 * 1000);
    };

    const show = (text: string) => {
      setPrompt(text); setVisible(true);
      getMixer().duck(1200, -6);
    };

    scheduleHydration();
    scheduleCue();

    return ()=> { alive = false; clearTimeout(hydrationTimer); clearTimeout(cueTimer); };
  }, [hydrationOn, mode]);

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





