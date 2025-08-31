import React from 'react';

type Props = { state: 'idle'|'walk'|'sit_pray'|'stretch'|'drink'|'pick_eat_fruit'; intervalMs?: number };

const LINES: Record<string, string[]> = {
  idle: ['Be here, without rush.', 'Let the mind soften.', 'Quiet is also movement.'],
  walk: ['Each step is enough.', 'Weight through the heel, then toe.', 'Breathe with the rhythm.'],
  sit_pray: ['Lean into presence.', 'Words can be few.', 'Let the heart speak.'],
  stretch: ['Lengthen gently.', 'Ease, not strain.', 'Give the spine space.'],
  drink: ['Receive what restores.', 'Small sips are holy.', 'Hydrate, then return.'],
  pick_eat_fruit: ['Lower with care.', 'Ground meets you.', 'Rise slowly.']
};

export default function JourneyMicroAffirmations({ state, intervalMs = 20000 }: Props){
  const [i, setI] = React.useState(0);
  React.useEffect(()=>{
    let id = setInterval(()=> setI(x => (x+1) % (LINES[state]?.length||1)), intervalMs);
    return ()=> clearInterval(id);
  }, [state, intervalMs]);
  const text = (LINES[state] && LINES[state][i]) || '';
  return <div aria-live="polite" style={{marginTop:8, fontSize:14, opacity:.85}}>{text}</div>;
}


