import { encrypt, decrypt } from './crypto';
import type { ProfileData, AppearanceVariant } from 'types/profile';

type ProfilesIndexItem = {
  id: string;
  name: string;
  createdAt: number;
  appearance?: { healing?: AppearanceVariant; journey?: AppearanceVariant };
  preferences?: { theme?: 'forest'|'ocean'|'mountain'|'autumn'|'snow' };
  consent?: { localMetrics?: boolean };
};

type ProfilesIndex = Record<string, ProfilesIndexItem>;

const INDEX_KEY = 'afw:profiles:index';
const ACTIVE_KEY = 'afw:profiles:active';
const PROFILE_PREFIX = 'afw:profiles:v1:';

let session: { id: string; name: string; data?: ProfileData } | null = null;
let ephemeralPassphrase: string | null = null;

function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }

export function listProfiles(): ProfilesIndexItem[]{
  try{
    const raw = localStorage.getItem(INDEX_KEY); if (!raw) return [];
    const idx: ProfilesIndex = JSON.parse(raw);
    return Object.values(idx).sort((a,b)=>a.createdAt-b.createdAt);
  }catch{ return []; }
}

function saveIndex(list: ProfilesIndexItem[]){
  const idx: ProfilesIndex = {}; list.forEach(p => idx[p.id]=p);
  localStorage.setItem(INDEX_KEY, JSON.stringify(idx));
}

async function reencryptAndPersist(data: ProfileData){
  if (!session || !ephemeralPassphrase) throw new Error('locked');
  const blob = await encrypt(ephemeralPassphrase, JSON.stringify(data));
  localStorage.setItem(PROFILE_PREFIX + data.id, blob);
  // update index meta
  const list = listProfiles();
  const i = list.findIndex(p => p.id === data.id);
  const meta: ProfilesIndexItem = {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    appearance: data.appearance,
    preferences: { theme: data.preferences.theme },
    consent: { localMetrics: data.consent.localMetrics }
  };
  if (i>=0) list[i] = meta; else list.push(meta);
  saveIndex(list);
  // update session
  session.data = data;
}

export async function createProfile(
  name: string,
  passphrase: string,
  opts?: {
    pronouns?: string;
    theme?: 'forest'|'ocean'|'mountain'|'autumn'|'snow';
    healing?: AppearanceVariant;
    journey?: AppearanceVariant;
    consentLocalMetrics?: boolean;
  }
){
  const id = uid();
  const data: ProfileData = {
    id,
    name,
    pronouns: opts?.pronouns?.trim() || undefined,
    createdAt: Date.now(),
    appearance: {
      healing: opts?.healing || 'A',
      journey: opts?.journey || 'A'
    },
    preferences: {
      theme: opts?.theme || 'forest',
      tts: { rate: 0.92, pitch: 0.97 },
      audio: { master: 0.6 }
    },
    consent: { localMetrics: opts?.consentLocalMetrics ?? true }
  };

  const blob = await encrypt(passphrase, JSON.stringify(data));
  localStorage.setItem(PROFILE_PREFIX + id, blob);

  const meta: ProfilesIndexItem = {
    id, name, createdAt: data.createdAt,
    appearance: data.appearance,
    preferences: { theme: data.preferences.theme },
    consent: { localMetrics: data.consent.localMetrics }
  };
  const list = listProfiles(); list.push(meta); saveIndex(list);
  return meta;
}

export async function unlockProfile(id: string, passphrase: string){
  const blob = localStorage.getItem(PROFILE_PREFIX + id); if (!blob) throw new Error('not-found');
  try{
    const plain = await decrypt(passphrase, blob);
    const data: ProfileData = JSON.parse(plain);
    session = { id, name: data.name, data };
    ephemeralPassphrase = passphrase;
    sessionStorage.setItem(ACTIVE_KEY, id);
    return true;
  }catch{ throw new Error('bad-passphrase'); }
}

export function lockProfile(){
  session = null;
  ephemeralPassphrase = null;
  sessionStorage.removeItem(ACTIVE_KEY);
}

export function getActiveProfile(): { id:string; name:string } | null{
  if (session) return { id: session.id, name: session.name };
  const id = sessionStorage.getItem(ACTIVE_KEY);
  if (!id) return null;
  const meta = listProfiles().find(x=>x.id===id); if (!meta) return null;
  return { id: meta.id, name: meta.name };
}

export function getActiveProfileData(): ProfileData | null{
  return session?.data || null;
}

export function getEphemeralPassphrase(){ return ephemeralPassphrase; }

export function removeProfile(id: string){
  const list = listProfiles().filter(p => p.id !== id);
  saveIndex(list);
  localStorage.removeItem(PROFILE_PREFIX + id);
  if (session?.id === id) lockProfile();
}

export function getProfileMeta(id: string): ProfilesIndexItem | undefined{
  return listProfiles().find(x=>x.id===id);
}

// NEW: update appearance safely (requires unlocked session)
export async function setAppearance(kind: 'healing'|'journey', variant: AppearanceVariant){
  if (!session?.data) throw new Error('locked');
  const d = { ...session.data, appearance: { ...session.data.appearance, [kind]: variant } };
  await reencryptAndPersist(d);
}




