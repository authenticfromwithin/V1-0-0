export type HealingIntention = 'reflect'|'move'|'pray';
export type HealingInput = { intention: HealingIntention; hydration?: boolean };
export type HealingState = 'idle'|'walk'|'stretch'|'drink'|'sit_pray'|'pick_eat_fruit';

let lastReflect = 0;
let lastHydration = 0;
let lastMove = 0;

function now(){ return Date.now(); }
function chance(p: number){ return Math.random() < p; }

export function decideHealingState(input: HealingInput): HealingState {
  const t = now();

  if (input.hydration) {
    if (t - lastHydration > 3*60*1000) {
      lastHydration = t;
      return 'drink';
    }
  }

  if (input.intention === 'pray') return 'sit_pray';

  if (input.intention === 'move') {
    if (t - lastMove > 45000 && chance(0.25)) { lastMove = t; return 'stretch'; }
    return 'walk';
  }

  if (t - lastReflect > 60000 && chance(0.2)) { lastReflect = t; return 'stretch'; }
  return 'idle';
}


