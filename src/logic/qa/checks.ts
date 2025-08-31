export type Check = { id: string; label: string; run: () => Promise<{ok:boolean; detail?:string}> };

const themes = ['forest','ocean','mountain','autumn','snow'] as const;
const stems = ['wind','water','leaves','birds','pad'] as const;

async function head(url: string){ try { const r = await fetch(url, {method:'HEAD'}); return r.ok; } catch { return false; } }

export const checks: Check[] = [
  { id: 'devotionals-manifest', label: 'Devotionals manifest present', run: async () => ({ ok: await head('/content/devotionals.manifest.json') }) },
  { id: 'quotes-manifest', label: 'Quotes manifest present', run: async () => ({ ok: await head('/content/quotes.manifest.json') }) },
  ...themes.flatMap(t => stems.map(s => ({
    id: `stem-${t}-${s}`, label: `Audio stem ${t}/${s}`, run: async () => ({ ok: await head(`/assets/audio/${t}/stems/${s}.mp3`) })
  }))),
  { id: 'healing-idle-webm', label: 'Healing idle WEBM exists',
    run: async () => ({ ok: await head('/assets/avatars/healing/idle/variant-01/webm/idle.webm') || await head('/assets/avatars/healing/idle/webm/idle.webm') }) },
  { id: 'journey-idle-webm', label: 'Journey idle WEBM exists',
    run: async () => ({ ok: await head('/assets/avatars/journey/idle/variant-01/webm/idle.webm') || await head('/assets/avatars/journey/idle/webm/idle.webm') }) }
];


