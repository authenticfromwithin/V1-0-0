import type { AvatarRig } from 'types/avatar';

export type Archetype = 'archetype-a' | 'archetype-b';
export type Variant = 'default' | 'variant-01' | 'variant-02';

export type AvatarProfile = {
  archetype: Archetype;
  variant: Variant;
};

const KEY = 'afw:avatar:profile';

export const defaultProfile: AvatarProfile = {
  archetype: 'archetype-a',
  variant: 'default',
};

export function getProfile(): AvatarProfile {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw);
    return { ...defaultProfile, ...parsed };
  } catch {
    return defaultProfile;
  }
}

export function setProfile(p: AvatarProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent('afw:avatarprofilechange', { detail: p }));
}

function mapSrc(src: string, rigName: 'healing'|'journey', p: AvatarProfile): string {
  // Legacy default (A/default) uses the top-level path; do not rewrite
  if (p.archetype === 'archetype-a' && p.variant === 'default') return src;
  const base = `/assets/avatars/${rigName}/${p.archetype}/${p.variant}`;
  return src.replace(new RegExp(`/assets/avatars/${rigName}/`), `${base}/`);
}

export function applyProfileToRig(rig: AvatarRig, rigName: 'healing'|'journey', p = getProfile()): AvatarRig {
  const out: AvatarRig = { name: rig.name, clips: {} as any };
  for (const key of Object.keys(rig.clips) as (keyof AvatarRig['clips'])[]) {
    const clip = rig.clips[key];
    out.clips[key] = {
      ...clip,
      sources: clip.sources.map(s => ({ ...s, src: mapSrc(s.src, rigName, p) })),
    } as any;
  }
  return out;
}




