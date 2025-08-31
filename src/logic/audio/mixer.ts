
// Lightweight WebAudio mixer with stem loading per theme, ducking, warm/cool tilt, and persistence.
export type StemName = 'wind'|'water'|'leaves'|'birds'|'pad';
export type ThemeName = ''|'ocean'|'mountain'|'autumn'|'snow';

type PersistShape = {
  theme: ThemeName;
  master: number;
  mood: number;
  stems: Record<StemName, number>;
};

const KEY = 'afw:mixer';
function loadPersist(): PersistShape | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // basic sanity
    if (typeof data !== 'object') return null;
    return {
      theme: (data.theme ?? '') as ThemeName,
      master: Number(data.master ?? 0.6),
      mood: Number(data.mood ?? 0),
      stems: {
        wind: Number(data.stems?.wind ?? 0),
        water: Number(data.stems?.water ?? 0),
        leaves: Number(data.stems?.leaves ?? 0),
        birds: Number(data.stems?.birds ?? 0),
        pad: Number(data.stems?.pad ?? 0),
      }
    };
  } catch { return null; }
}
function savePersist(p: PersistShape){
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}
function clamp01(v:number){ return Math.max(0, Math.min(1, v)); }

class AfwMixer {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  stems: Map<StemName, { gain: GainNode, src?: AudioBufferSourceNode, buf?: AudioBuffer }> = new Map();
  shelfLow: BiquadFilterNode | null = null;
  shelfHigh: BiquadFilterNode | null = null;
  currentTheme: ThemeName = '';
  persisted: PersistShape | null = null;

  ensure(){
    if (this.ctx) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const master = ctx.createGain(); master.gain.value = 0.6;
    const low = ctx.createBiquadFilter(); low.type = 'lowshelf'; low.frequency.value = 250;
    const high = ctx.createBiquadFilter(); high.type = 'highshelf'; high.frequency.value = 3500;
    master.connect(low); low.connect(high); high.connect(ctx.destination);
    (['wind','water','leaves','birds','pad'] as StemName[]).forEach(n => {
      const g = ctx.createGain(); g.gain.value = 0; g.connect(master);
      this.stems.set(n, { gain: g });
    });
    this.ctx = ctx; this.master = master; this.shelfLow = low; this.shelfHigh = high;
    // Load persisted once
    this.persisted = loadPersist();
    if (this.persisted) {
      master.gain.value = clamp01(this.persisted.master);
      this.setMood(this.persisted.mood);
    }
  }

  async loadTheme(theme: ThemeName){
    this.ensure(); if (!this.ctx) return;
    if (!theme) theme = ''; // '' = forest fallback
    // Re-load only if different theme
    if (this.currentTheme !== theme) {
      this.stopAll();
      this.currentTheme = theme;
      const base = `/assets/audio/${theme || 'forest'}/stems`;
      for (const [name, entry] of this.stems){
        try {
          const url = `${base}/${name}.mp3`;
          const r = await fetch(url, { cache:'force-cache' });
          if (!r.ok) continue;
          const buf = await r.arrayBuffer();
          entry.buf = await this.ctx.decodeAudioData(buf.slice(0));
          this.startStem(name);
        } catch {}
      }
    }
    // Apply persisted stem levels if present
    if (!this.persisted) this.persisted = loadPersist();
    if (this.persisted?.stems) {
      for (const n of ['wind','water','leaves','birds','pad'] as StemName[]) {
        this.setVolume(n, this.persisted.stems[n], false);
      }
    }
    // Persist theme
    this.save();
  }

  startStem(name: StemName){
    if (!this.ctx) return; const entry = this.stems.get(name); if (!entry || !entry.buf) return;
    if (entry.src) try { entry.src.stop(); } catch {}
    const src = this.ctx.createBufferSource();
    src.buffer = entry.buf; src.loop = true; src.connect(entry.gain); src.start(0);
    entry.src = src;
  }

  setVolume(name: StemName, v: number, doSave=true){
    const e = this.stems.get(name); if (!e) return;
    e.gain.gain.value = clamp01(v);
    if (doSave) this.save();
  }
  setMaster(v: number){ if (this.master) { this.master.gain.value = clamp01(v); this.save(); } }
  setMood(mood: number){
    if (!this.shelfLow || !this.shelfHigh) return;
    const m = Math.max(-1, Math.min(1, mood));
    this.shelfLow.gain.value = m * 4; this.shelfHigh.gain.value = m * -3;
    this.save();
  }

  async duck(ms = 900, db = -6){
    if (!this.master || !this.ctx) return; const g = this.master.gain;
    const now = this.ctx.currentTime; const start = g.value; const target = Math.max(0, start * Math.pow(10, db/20));
    g.cancelScheduledValues(now); g.setValueAtTime(start, now); g.linearRampToValueAtTime(target, now + 0.06);
    g.linearRampToValueAtTime(start, now + ms/1000);
  }

  stopAll(){ for (const [,e] of this.stems){ try { e.src?.stop(); } catch {} e.src = undefined; } }

  resetToDefaults(){
    // Soft, contemplative default bed
    const def = { master: 0.6, mood: 0, stems: { wind:0.35, water:0.45, leaves:0.25, birds:0.18, pad:0.35 } };
    this.setMaster(def.master);
    this.setMood(def.mood);
    (Object.keys(def.stems) as StemName[]).forEach(k => this.setVolume(k, (def.stems as any)[k], false));
    this.save();
  }

  save(){
    const snap: PersistShape = {
      theme: this.currentTheme,
      master: Number(this.master?.gain.value ?? 0.6),
      mood: Number(this.shelfLow?.gain.value ? (this.shelfLow!.gain.value / 4) : (this.persisted?.mood ?? 0)),
      stems: {
        wind: Number(this.stems.get('wind')?.gain.gain.value ?? 0),
        water: Number(this.stems.get('water')?.gain.gain.value ?? 0),
        leaves: Number(this.stems.get('leaves')?.gain.gain.value ?? 0),
        birds: Number(this.stems.get('birds')?.gain.gain.value ?? 0),
        pad: Number(this.stems.get('pad')?.gain.gain.value ?? 0),
      }
    };
    this.persisted = snap;
    savePersist(snap);
  }
}

let MIXER: AfwMixer | null = null;
export function getMixer(){ if (!MIXER) MIXER = new AfwMixer(); return MIXER; }
export type { PersistShape };


