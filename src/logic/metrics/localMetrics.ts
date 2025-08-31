import { getActiveProfile, getProfileMeta } from '@/logic/auth/store';

type Counters = {
  visits: Record<string, number>;       // route -> count
  play: Record<string, number>;         // "rig:state" -> count
  minutes: number;                      // rough minutes of presence
  journalSaves: number;
  lastAt?: number;
};

function key(id: string){ return `afw:metrics:${id}`; }

export function track(fn: (c: Counters) => void){
  const active = getActiveProfile();
  if (!active) return;
  const meta = getProfileMeta(active.id);
  if (meta?.consent?.localMetrics === false) return; // respect consent

  const raw = localStorage.getItem(key(active.id));
  let c: Counters = raw ? JSON.parse(raw) : { visits:{}, play:{}, minutes:0, journalSaves:0 };
  const now = Date.now();
  if (c.lastAt){ const dt = Math.max(0, Math.min(5*60*1000, now - c.lastAt)); c.minutes += dt/60000; }
  c.lastAt = now;

  fn(c);

  localStorage.setItem(key(active.id), JSON.stringify(c));
}

export const Metrics = {
  route(route: string){ track(c => { c.visits[route] = (c.visits[route]||0) + 1; }); },
  state(rig: string, state: string){ track(c => { const k = `${rig}:${state}`; c.play[k] = (c.play[k]||0) + 1; }); },
  journalSaved(){ track(c => { c.journalSaves += 1; }); },
  get(){
    const active = getActiveProfile();
    if (!active) return null;
    const raw = localStorage.getItem(key(active.id));
    return raw ? JSON.parse(raw) as Counters : null;
  },
  reset(){
    const active = getActiveProfile();
    if (!active) return;
    localStorage.removeItem(key(active.id));
  }
};





