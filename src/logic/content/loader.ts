import type { QuotesManifest, QuoteItem, DevotionalsManifest, Devotional } from '../../types/content';

const BASE = '/content'; // served from public/content
const LS = {
  theme: 'afw.v1.theme',
  quotesProgress: 'afw.v1.quotes.progress' // { [quoteId]: ISOString }
};

export function getTheme(): string {
  return localStorage.getItem(LS.theme) || 'forest';
}
export function setTheme(t: string) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(LS.theme, t);
}

/** Load JSON helper with no-cache to ease dev */
async function loadJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function loadQuotesManifest(): Promise<QuotesManifest> {
  return loadJSON<QuotesManifest>(`${BASE}/quotes.manifest.json`);
}

export async function loadQuotesForCategory(cat: string, manifest?: QuotesManifest): Promise<QuoteItem[]> {
  const man = manifest ?? await loadQuotesManifest();
  const files = man.files[cat] || [];
  const batches = await Promise.all(files.map(fp => loadJSON<QuoteItem[]>(`${BASE}/${fp}`)));
  return batches.flat();
}

export function getQuotesProgress(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LS.quotesProgress) || '{}');
  } catch {
    return {};
  }
}
export function markQuoteWorked(id: string) {
  const m = getQuotesProgress();
  m[id] = new Date().toISOString();
  localStorage.setItem(LS.quotesProgress, JSON.stringify(m));
}
export function isQuoteWorked(id: string): boolean {
  const m = getQuotesProgress();
  return !!m[id];
}

export async function loadDevotionalsManifest(): Promise<DevotionalsManifest> {
  return loadJSON<DevotionalsManifest>(`${BASE}/devotionals.manifest.json`);
}
export async function loadDevotionalsForMonth(ym: string, manifest?: DevotionalsManifest): Promise<Devotional[]> {
  const man = manifest ?? await loadDevotionalsManifest();
  const files = man.files[ym] || [];
  const batches = await Promise.all(files.map(fp => loadJSON<Devotional>(`${BASE}/${fp}`)));
  return batches;
}

export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}