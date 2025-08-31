export type Source = { type: string; src: string };
export type Clip = { label: string; sources: Source[]; loop: boolean; poster?: string };
export type AvatarRig = { name: string; clips: Record<string, Clip> };




