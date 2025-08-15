// Avatar types
export type AvatarKind = 'healing' | 'journey';
export type AvatarPose =
  | 'idle' | 'walk' | 'sit_pray' | 'stretch' | 'drink_water' | 'pick_eat_fruit';

export interface AvatarSources {
  webm?: string;
  hevc?: string;   // .mp4 container (HEVC/H.265) — Safari/iOS prefer this
  stills?: string; // AVIF/PNG fallback
}

export type AvatarManifest = {
  version: string;
  codecFallbackOrder: Array<'webm'|'hevc'|'stills'>;
  avatars: Record<AvatarKind, Partial<Record<AvatarPose, AvatarSources>>>;
};
