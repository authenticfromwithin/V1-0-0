export type Check = { id: string; ok: boolean; note?: string };
export type Section = { name: string; checks: Check[] };

async function head(url: string){ try{ const r = await fetch(url, { method:'HEAD' }); return r.ok; }catch{ return false; } }

export async function validateDevotionals(): Promise<Section>{
  const checks: Check[] = [];
  try{
    const manifest = await fetch('/content/devotionals.manifest.json').then(r=>r.json());
    for (const item of manifest){
      const id = item.id || item.date || '';
      if (!id){ checks.push({ id:'manifest-id', ok:false, note:'Missing id/date' }); continue; }
      const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.test(id);
      checks.push({ id:`${id}#date-format`, ok: ymd, note: ymd?undefined:'Use YYYY-MM-DD' });
      const ym = id.slice(0,7);
      const jsonUrl = `/content/devotionals/${ym}/devotional-${id}.json`;
      const jsonOk = await head(jsonUrl);
      checks.push({ id:`${id}#json`, ok: jsonOk, note: jsonOk?undefined:`Missing ${jsonUrl}` });
      const vttOk = await head(`/narration/captions/${id}.vtt`);
      checks.push({ id:`${id}#vtt`, ok: vttOk, note: vttOk?undefined:'No captions' });
      const mp3 = await head(`/narration/tracks/${id}.mp3`);
      const ogg = await head(`/narration/tracks/${id}.ogg`);
      const hasAudio = mp3 || ogg;
      checks.push({ id:`${id}#audio`, ok: hasAudio, note: hasAudio?undefined:'No uploaded audio (TTS fallback will be used)' });
    }
  }catch{
    checks.push({ id:'devotionals.manifest.json', ok:false, note:'Cannot load or parse' });
  }
  return { name:'Devotionals', checks };
}

export async function validateQuotes(): Promise<Section>{
  const checks: Check[] = [];
  try{
    const manifest = await fetch('/content/quotes.manifest.json').then(r=>r.json());
    const isArray = Array.isArray(manifest);
    checks.push({ id:'quotes.manifest.json#array', ok:isArray, note: isArray?undefined:'Manifest must be an array'});
    if (isArray){
      for (const q of manifest){
        const hasText = !!q.text || !!q.quote;
        checks.push({ id:`quote#${(q.id||q.text||'').slice(0,24)}`, ok: hasText, note: hasText?undefined:'Missing quote text' });
      }
    }
  }catch{
    checks.push({ id:'quotes.manifest.json', ok:false, note:'Cannot load or parse' });
  }
  return { name:'Quotes', checks };
}

export async function validateScenesAndAvatars(): Promise<Section>{
  const checks: Check[] = [];
  const themes = ['forest','ocean','mountain','autumn','snow'];
  const plates = ['back.webp','mid.webp','front.webp'];
  for (const t of themes){
    for (const p of plates){
      const ok = await head(`/assets/scenes/${t}/plates/${p}`);
      checks.push({ id:`scene:${t}:${p}`, ok, note: ok?undefined:'missing plate' });
    }
  }
  const rigs = [
    { name:'healing', states:['idle','walk','stretch','drink','sit_pray','pick_eat_fruit'] },
    { name:'journey', states:['idle','walk','stretch','drink','sit_pray','pick_eat_fruit'] }, // journey uses aliases
  ] as const;
  for (const r of rigs){
    for (const s of r.states){
      const webm = await head(`/assets/avatars/${r.name}/${s}/webm/${s}.webm`);
      const mp4  = await head(`/assets/avatars/${r.name}/${s}/mp4/${s}.mp4`);
      checks.push({ id:`avatar:${r.name}:${s}:webm`, ok:webm });
      checks.push({ id:`avatar:${r.name}:${s}:mp4`, ok:mp4 });
    }
  }
  return { name:'Scenes & Avatars', checks };
}

export async function runAll(){
  const sections = await Promise.all([ validateDevotionals(), validateQuotes(), validateScenesAndAvatars() ]);
  const ok = sections.every(sec => sec.checks.every(c => c.ok));
  return { ok, sections };
}




