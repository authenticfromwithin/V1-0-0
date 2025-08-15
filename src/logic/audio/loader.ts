type Track = { id: string; webm?: string; m4a?: string; gain?: number; loop?: boolean };
type AmbienceManifest = {
  version: string;
  codecFallbackOrder: Array<'webm'|'m4a'>;
  ambience: Record<string, Track[]>;
};

function canPlay(type: string) {
  const a = document.createElement('audio');
  return !!a.canPlayType && a.canPlayType(type) !== '';
}

const SUPPORT = {
  webm: () => canPlay('audio/webm; codecs=opus') || canPlay('audio/webm'),
  m4a:  () => canPlay('audio/mp4; codecs=mp4a.40.2') || canPlay('audio/aac') || canPlay('audio/mp4')
};

export async function loadAmbience(manifestUrl = '/assets/manifests/audio.manifest.json') {
  const res = await fetch(manifestUrl, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Failed to load audio manifest');
  return (await res.json()) as AmbienceManifest;
}

export function pickTrackUrl(order: Array<'webm'|'m4a'>, trk: Track): string | null {
  for (const key of order) {
    const url = trk[key];
    if (url) {
      if (SUPPORT[key as keyof typeof SUPPORT]()) return url;
    }
  }
  return trk.m4a ?? trk.webm ?? null;
}
