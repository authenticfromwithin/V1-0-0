export function getPref<T=any>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return (v === null ? fallback : JSON.parse(v)); }
  catch { return fallback; }
}
export function setPref(key: string, value: any){
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getVariant(rig: 'healing'|'journey'): string {
  try { return localStorage.getItem(`afw:variant:${rig}`) || 'variant-01'; } catch { return 'variant-01'; }
}
export function setVariant(rig: 'healing'|'journey', v: string){
  try { localStorage.setItem(`afw:variant:${rig}`, v); } catch {}
}


