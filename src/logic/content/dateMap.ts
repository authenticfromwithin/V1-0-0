/**
 * AFW date mapping — recycle a single base-year (2025) content set across any year.
 * - id format stays YYYY-MM-DD (we use 2025-* for storage)
 * - display uses the user's current year
 * - Leap day (Feb 29) reuses Feb 28 content by default.
 */

export const BASE_YEAR = 2025 as const;

export function toISO(d: Date){
  return d.toISOString().slice(0,10);
}

export function pad(n: number){ return n < 10 ? `0${n}` : String(n); }

export function mapAnyDateToBase(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;   // 1..12
  const d = date.getDate();        // 1..31

  // Handle Feb 29: duplicate Feb 28 (or switch to Mar 1 — policy flag if ever needed)
  if (m === 2 && d === 29){
    return `${BASE_YEAR}-02-28`;
  }
  return `${BASE_YEAR}-${pad(m)}-${pad(d)}`;
}

export function daysOfYear(year: number): string[] {
  const out: string[] = [];
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  for (let t = +start; t < +end; t += 24*3600*1000){
    const d = new Date(t);
    out.push(toISO(d));
  }
  return out;
}
