import type { AvatarManifest, AvatarKind, AvatarPose, AvatarSources } from '../../types/avatar';

function canPlayVideoType(mime: string) {
  const v = document.createElement('video');
  return !!v.canPlayType && v.canPlayType(mime) !== '';
}

const SUPPORT = {
  webm: () => canPlayVideoType('video/webm; codecs="vp9,vorbis"') || canPlayVideoType('video/webm'),
  hevc: () => canPlayVideoType('video/mp4; codecs="hvc1.1.L123.B0"') || canPlayVideoType('video/mp4; codecs="hev1"') || canPlayVideoType('video/mp4'),
  stills: () => true
};

export function pickSource(order: Array<'webm'|'hevc'|'stills'>, src: AvatarSources): string | null {
  for (const key of order) {
    if (src[key]) {
      if (key === 'stills' || SUPPORT[key as keyof typeof SUPPORT]()) return src[key] as string;
    }
  }
  return src.stills ?? null;
}

export async function loadAvatar(manifestUrl = '/assets/manifests/avatars.manifest.json') {
  const res = await fetch(manifestUrl, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load avatar manifest: ${res.status}`);
  const manifest = (await res.json()) as AvatarManifest;
  return manifest;
}

export function getAvatarSource(manifest: AvatarManifest, kind: AvatarKind, pose: AvatarPose): string | null {
  const entry = manifest.avatars[kind]?.[pose];
  if (!entry) return null;
  return pickSource(manifest.codecFallbackOrder, entry);
}
