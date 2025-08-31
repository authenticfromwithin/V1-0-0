export type Notice = { id: string; title: string; body?: string; date?: string; url?: string };

const KEY = 'afw:notices:read';

export function getRead(): Set<string>{
  try { return new Set(JSON.parse(localStorage.getItem(KEY)||'[]')); } catch { return new Set(); }
}
export function markRead(id: string){
  const s = getRead(); s.add(id);
  localStorage.setItem(KEY, JSON.stringify(Array.from(s)));
}
export function unreadCount(list: Notice[]): number{
  const s = getRead(); return list.filter(n => !s.has(n.id)).length;
}

export async function fetchNotices(): Promise<Notice[]>{
  try {
    const r = await fetch('/content/announcements.json', { cache:'no-store' });
    if (!r.ok) return [];
    return await r.json();
  } catch { return []; }
}


