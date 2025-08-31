export type JourneyState = 'idle'|'walk'|'sit_pray'|'stretch'|'drink'|'pick_eat_fruit';
export type JourneyAction = 'idle'|'walk'|'pray'|'reflect'|'read'|'kneel';

const COOLDOWN_MS: Record<JourneyAction, number> = {
  idle: 0, walk: 1500, pray: 2000, reflect: 2000, read: 2000, kneel: 2500
};

export class JourneyFSM {
  private last: Record<JourneyAction, number> = { idle:0, walk:0, pray:0, reflect:0, read:0, kneel:0 };
  private current: JourneyState = 'idle';

  now(){ return Date.now(); }
  can(a: JourneyAction){ const t = this.now(); return (t - (this.last[a]||0)) > COOLDOWN_MS[a]; }

  next(a: JourneyAction): JourneyState {
    const t = this.now();
    if (!this.can(a)) return this.current;
    this.last[a] = t;
    switch (a){
      case 'idle': this.current = 'idle'; break;
      case 'walk': this.current = 'walk'; break;
      case 'pray': this.current = 'sit_pray'; break;
      case 'reflect': this.current = 'stretch'; break;
      case 'read': this.current = 'drink'; break;
      case 'kneel': this.current = 'pick_eat_fruit'; break;
    }
    return this.current;
  }
}


