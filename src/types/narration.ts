export interface NarrationTrack {
  id: string;
  title: string;
  lang: 'en'|'af'|'ms'|'id';
  themeHint?: 'forest'|'ocean'|'mountain'|'autumn'|'snow';
  durSec?: number;
  webm?: string;
  m4a?: string;
  vtt?: string;
}

export interface NarrationManifest {
  version: string;
  tracks: NarrationTrack[];
}
