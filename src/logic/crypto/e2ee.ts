// Minimal client-side E2EE using WebCrypto (AES-GCM + PBKDF2).
// Purpose: encrypt small JSON payloads (e.g., account profile metadata) with a user passphrase.
// Not for large files. Journals remain local-only and are NOT synced.

function b64encode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
function b64decode(b64: string): ArrayBuffer {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i)
  return bytes.buffer
}

export function randomBytes(n=16): string {
  const a = new Uint8Array(n)
  crypto.getRandomValues(a)
  return b64encode(a.buffer)
}

async function deriveKey(passphrase: string, saltB64: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const salt = new Uint8Array(b64decode(saltB64))
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt','decrypt']
  )
}

export type EncryptedBundle = {
  version: number
  salt: string // base64(16)
  iv: string   // base64(12)
  ciphertext: string // base64
}

export async function encryptJSON(obj: any, passphrase: string): Promise<EncryptedBundle> {
  if (!passphrase || passphrase.length < 8) throw new Error('Passphrase must be at least 8 characters')
  const salt = randomBytes(16)
  const iv = randomBytes(12)
  const key = await deriveKey(passphrase, salt)
  const enc = new TextEncoder()
  const data = enc.encode(JSON.stringify(obj))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: new Uint8Array(b64decode(iv)) }, key, data)
  return { version: 1, salt, iv, ciphertext: b64encode(ct) }
}

export async function decryptJSON(bundle: EncryptedBundle, passphrase: string): Promise<any> {
  const key = await deriveKey(passphrase, bundle.salt)
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(b64decode(bundle.iv)) }, key, b64decode(bundle.ciphertext))
  const dec = new TextDecoder()
  return JSON.parse(dec.decode(pt))
}




