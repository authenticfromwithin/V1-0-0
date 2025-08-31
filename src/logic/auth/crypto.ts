const enc = new TextEncoder();
const dec = new TextDecoder();
export function b64(buf: ArrayBuffer){ return btoa(String.fromCharCode(...new Uint8Array(buf))); }
export function ub64(s: string){ return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }
export async function deriveKey(pass: string, salt: Uint8Array){ const base = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']); return crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations: 120_000, hash:'SHA-256'}, base, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']); }
export async function encrypt(pass: string, plain: string){ const iv = crypto.getRandomValues(new Uint8Array(12)); const salt = crypto.getRandomValues(new Uint8Array(16)); const key = await deriveKey(pass, salt); const data = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(plain)); return JSON.stringify({ iv: b64(iv), salt: b64(salt), data: b64(data) }); }
export async function decrypt(pass: string, blob: string){ const { iv, salt, data } = JSON.parse(blob); const key = await deriveKey(pass, ub64(salt)); const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv: ub64(iv)}, key, ub64(data)); return dec.decode(plain); }




