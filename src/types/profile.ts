export type AppearanceVariant = 'A'|'B'|'C';

export type TtsPrefs = { voiceURI?: string; rate?: number; pitch?: number; };
export type AudioPrefs = { master?: number; stems?: Partial<Record<'wind'|'water'|'leaves'|'birds'|'pad', number>>; };
export type ProfileData = { id: string; name: string; pronouns?: string; createdAt: number; appearance: { healing: AppearanceVariant; journey: AppearanceVariant; }; preferences: { theme: 'forest'|'ocean'|'mountain'|'autumn'|'snow'; tts: TtsPrefs; audio: AudioPrefs; }; consent: { localMetrics: boolean; }; };




