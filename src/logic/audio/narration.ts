import type { NarrationManifest, NarrationTrack } from '../../types/narration';

function canPlay(type: string) {
  const a = document.createElement('audio');
  return !!a.canPlayType && a.canPlayType(type) !== '';
}
const SUPPORT = {
  webm: () => canPlay('audio/webm; codecs=opus') || canPlay('audio/webm'),
  m4a:  () => canPlay('audio/mp4; codecs=mp4a.40.2') || canPlay('audio/mp4')
};

export async function loadNarration(manifestUrl = '/assets/manifests/narration.manifest.json'): Promise<NarrationManifest> {
  const res = await fetch(manifestUrl, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Failed to load narration manifest');
  return res.json();
}

export function pickNarrationUrl(t: NarrationTrack): string | null {
  if (t.webm && SUPPORT.webm()) return t.webm;
  if (t.m4a && SUPPORT.m4a()) return t.m4a;
  return t.m4a ?? t.webm ?? null;
}
