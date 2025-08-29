export type Announcement = { id: string; title: string; body?: string; date?: string; url?: string };
const KEY = 'afw:ann:seen';

export async function fetchAnnouncements(): Promise<Announcement[]>{
  try{
    const r = await fetch('/content/announcements.json', { cache: 'no-store' });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j) ? j : [];
  }catch{ return []; }
}

export function getSeen(): Record<string, number>{
  try{ return JSON.parse(localStorage.getItem(KEY) || '{}'); }catch{ return {}; }
}
export function markSeen(id: string){
  try{ const s = getSeen(); s[id] = Date.now(); localStorage.setItem(KEY, JSON.stringify(s)); }catch{}
}
export function unseenCount(items: Announcement[]): number{
  const s = getSeen(); return items.filter(a => !s[a.id]).length;
}
