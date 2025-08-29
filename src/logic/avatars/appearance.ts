export type Archetype = '' | 'archetype-a' | 'archetype-b';
export type Variant = '' | 'variant-01' | 'variant-02';
export type Appearance = { archetype: Archetype; variant: Variant };

const KEY_HEALING = 'afw:appearance:healing';
const KEY_JOURNEY = 'afw:appearance:journey';

export function loadAppearance(kind: 'healing'|'journey'): Appearance {
  const raw = localStorage.getItem(kind === 'healing' ? KEY_HEALING : KEY_JOURNEY);
  if (!raw) return { archetype: '', variant: '' };
  try { const a = JSON.parse(raw); return { archetype: a.archetype || '', variant: a.variant || '' }; }
  catch { return { archetype: '', variant: '' }; }
}
export function saveAppearance(kind: 'healing'|'journey', a: Appearance){
  localStorage.setItem(kind === 'healing' ? KEY_HEALING : KEY_JOURNEY, JSON.stringify(a));
}

export function useAppearance(kind: 'healing'|'journey'){
  // small hook to read+write and cause re-render
  const [ap, setAp] = require('react').useState<Appearance>(()=>loadAppearance(kind));
  const update = (next: Appearance) => { saveAppearance(kind, next); setAp(next); };
  require('react').useEffect(()=>{ setAp(loadAppearance(kind)); }, [kind]);
  return [ap, update] as const;
}

// Rewrites rig clip sources to include archetype/variant path segments when selected.
// Expected original src: /assets/avatars/<rig.name>/<state>/<fmt>/<file>
// Rewritten:            /assets/avatars/<rig.name>/<archetype>/<variant>/<state>/<fmt>/<file>
export function applyAppearanceToRig(rig: any, a: Appearance){
  if (!a.archetype && !a.variant) return rig;
  const clone = JSON.parse(JSON.stringify(rig));
  const arch = a.archetype || '';
  const vari = a.variant || '';
  const insert = (src: string) => {
    try {
      const parts = src.split('/'); // ["", "assets","avatars", rig, state, fmt, file]
      const iRig = parts.indexOf('avatars') + 2; // index of rig name
      const iState = iRig + 1;
      if (iRig <= 1 || iState >= parts.length) return src;
      const rigName = parts[iRig];
      const stateName = parts[iState];
      const fmt = parts[iState+1];
      const file = parts[iState+2];
      const prefix = parts.slice(0, iRig+1).join('/'); // up to rig name
      const archSeg = arch ? f"/{arch}" : "";
      const varSeg = vari ? f"/{vari}" : "";
      return f"{prefix}{archSeg}{varSeg}/{stateName}/{fmt}/{file}";
    } catch { return src; }
  };
  for (const k in clone.clips){
    const clip = clone.clips[k];
    if (!clip?.sources) continue;
    clip.sources = clip.sources.map((s: any) => ({ ...s, src: insert(s.src) }));
  }
  return clone;
}
