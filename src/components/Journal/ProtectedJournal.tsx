import React, { useEffect, useMemo, useRef, useState } from 'react'

/**
 * ProtectedJournal
 * - Local-only journaling (IndexedDB)
 * - Optional passphrase encryption (AES-GCM with PBKDF2)
 * - Clipboard/drag/context disabled inside the component root
 * - No uploads/no network: never sends data anywhere
 *
 * Paths: src/components/Journal/ProtectedJournal.tsx
 * Import: import ProtectedJournal from 'journal/ProtectedJournal'
 */

type Entry = {
  id?: number
  createdAt: number
  updatedAt: number
  title: string
  content: string // plaintext if not encrypted; otherwise base64 ciphertext
  iv?: string     // base64 IV if encrypted
  enc?: boolean   // true if encrypted
}

const DB_NAME = 'afw_journal'
const DB_VERSION = 1
const STORE = 'entries'

const SALT_KEY = 'afw_journal_salt'
const ENC_ENABLED_KEY = 'afw_journal_enc_enabled'

// ---------- IndexedDB minimal helpers ----------
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
        store.createIndex('updatedAt', 'updatedAt')
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function putEntry(entry: Entry): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req = store.put(entry)
    req.onsuccess = () => resolve(req.result as number)
    req.onerror = () => reject(req.error)
  })
}

async function getEntries(): Promise<Entry[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const idx = store.index('updatedAt')
    const req = idx.getAll()
    req.onsuccess = () => {
      const rows = (req.result as Entry[]).sort((a, b) => b.updatedAt - a.updatedAt)
      resolve(rows)
    }
    req.onerror = () => reject(req.error)
  })
}

async function deleteEntry(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

// ---------- Crypto helpers (Web Crypto) ----------
const enc = new TextEncoder()
const dec = new TextDecoder()

function getOrCreateSalt(): Uint8Array {
  const existing = localStorage.getItem(SALT_KEY)
  if (existing) {
    return base64ToBytes(existing)
  }
  const salt = crypto.getRandomValues(new Uint8Array(16))
  localStorage.setItem(SALT_KEY, bytesToBase64(salt))
  return salt
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 150_000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

async function encryptText(plain: string, key: CryptoKey): Promise<{ ivB64: string; cipherB64: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain))
  return {
    ivB64: bytesToBase64(iv),
    cipherB64: bytesToBase64(new Uint8Array(cipher))
  }
}

async function decryptText(cipherB64: string, ivB64: string, key: CryptoKey): Promise<string> {
  const iv = base64ToBytes(ivB64)
  const cipher = base64ToBytes(cipherB64)
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
  return dec.decode(plain)
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

// ---------- UI component ----------
const ProtectedJournal: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [active, setActive] = useState<Entry | null>(null)
  const [text, setText] = useState('')
  const [title, setTitle] = useState('Untitled')
  const [loading, setLoading] = useState(true)
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(() => {
    return localStorage.getItem(ENC_ENABLED_KEY) === '1'
  })
  const [unlocked, setUnlocked] = useState<boolean>(() => !encryptionEnabled)
  const [pass, setPass] = useState('')

  const rootRef = useRef<HTMLDivElement>(null)
  const canCrypto = typeof window !== 'undefined' && !!window.crypto?.subtle
  const salt = useMemo(() => getOrCreateSalt(), [])

  useEffect(() => {
    // Block clipboard / drag / context within this component only
    const root = rootRef.current
    if (!root) return
    const block = (e: Event) => { e.preventDefault(); e.stopPropagation() }
    const events = ['copy','cut','paste','dragstart','drop','contextmenu']
    events.forEach(ev => root.addEventListener(ev, block, { capture: true } as any))
    return () => { events.forEach(ev => root.removeEventListener(ev, block as any, { capture: true } as any)) }
  }, [])

  useEffect(() => {
    (async () => {
      const rows = await getEntries()
      setEntries(rows)
      if (rows.length) {
        setActive(rows[0])
      } else {
        // seed an empty entry
        const newE: Entry = {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          title: 'Untitled',
          content: '',
          enc: false
        }
        const id = await putEntry(newE)
        newE.id = id
        setEntries([newE])
        setActive(newE)
      }
      setLoading(false)
    })().catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    // hydrate text when active changes (decrypt if needed)
    (async () => {
      if (!active) return
      setTitle(active.title || 'Untitled')
      if (active.enc) {
        if (!canCrypto) {
          setText('[Encrypted content - WebCrypto not available]')
          return
        }
        if (!pass || !unlocked) {
          setText('[Locked — enter passphrase to view]')
          return
        }
        try {
          const key = await deriveKey(pass, salt)
          const plain = await decryptText(active.content, active.iv!, key)
          setText(plain)
        } catch {
          setText('[Wrong passphrase]')
        }
      } else {
        setText(active.content)
      }
    })()
  }, [active, unlocked, pass])

  async function handleSave() {
    if (!active) return
    const now = Date.now()
    let entry: Entry = {
      ...(active as Entry),
      title: title || 'Untitled',
      updatedAt: now,
    }

    if (encryptionEnabled && canCrypto) {
      const key = await deriveKey(pass, salt)
      const { ivB64, cipherB64 } = await encryptText(text, key)
      entry.content = cipherB64
      entry.iv = ivB64
      entry.enc = true
    } else {
      entry.content = text
      entry.enc = false
      entry.iv = undefined
    }

    const id = await putEntry(entry)
    entry.id = id
    setActive(entry)
    const latest = await getEntries()
    setEntries(latest)
  }

  async function handleNew() {
    const now = Date.now()
    const e: Entry = {
      createdAt: now,
      updatedAt: now,
      title: 'Untitled',
      content: '',
      enc: false
    }
    const id = await putEntry(e)
    e.id = id
    setEntries([e, ...entries])
    setActive(e)
    setText('')
    setTitle('Untitled')
  }

  async function handleDelete(id?: number) {
    if (!id) return
    await deleteEntry(id)
    const latest = await getEntries()
    setEntries(latest)
    setActive(latest[0] || null)
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleString()
  }

  function toggleEncryption(next: boolean) {
    setEncryptionEnabled(next)
    localStorage.setItem(ENC_ENABLED_KEY, next ? '1' : '0')
    if (!next) setUnlocked(true)
  }

  async function unlock() {
    if (!canCrypto) return
    if (!pass) return
    // Try decrypt first entry to validate
    if (active?.enc && active.iv) {
      try {
        const key = await deriveKey(pass, salt)
        await decryptText(active.content, active.iv, key)
        setUnlocked(true)
      } catch {
        alert('Passphrase incorrect.')
      }
    } else {
      setUnlocked(true)
    }
  }

  return (
    <div ref={rootRef} className="journal-root" style={styles.root} aria-label="Protected Journal">
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <strong>Protected Journal</strong>
          <span style={styles.subtle}> — Local only, {encryptionEnabled ? 'Encrypted' : 'Plain (local)'}</span>
        </div>
        <div style={styles.headerRight}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={encryptionEnabled}
              onChange={(e) => toggleEncryption(e.target.checked)}
              disabled={!canCrypto}
            />
            <span style={{marginLeft: 8}}>Encrypt with passphrase</span>
          </label>
          {encryptionEnabled && (
            <div style={styles.passRow}>
              <input
                type="password"
                placeholder="Passphrase"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                style={styles.passInput}
              />
              {!unlocked && <button onClick={unlock} style={styles.btn}>Unlock</button>}
            </div>
          )}
        </div>
      </div>

      <div style={styles.body}>
        <aside style={styles.sidebar} aria-label="Entries list">
          <button onClick={handleNew} style={{...styles.btn, width: '100%'}}>+ New Entry</button>
          <div style={styles.list}>
            {entries.map(e => (
              <button
                key={e.id}
                style={{...styles.listItem, ...(active?.id===e.id ? styles.listItemActive : {})}}
                onClick={() => setActive(e)}
                title={formatDate(e.updatedAt)}
              >
                <div style={styles.listTitle}>{e.title || 'Untitled'}</div>
                <div style={styles.listMeta}>{formatDate(e.updatedAt)}</div>
                {e.enc && <div style={styles.badge}>Encrypted</div>}
              </button>
            ))}
          </div>
        </aside>

        <main style={styles.editor} aria-live="polite">
          {loading || !active ? (
            <div>Loading…</div>
          ) : encryptionEnabled && !unlocked ? (
            <div style={styles.lockNotice}>Locked — enter passphrase to view.</div>
          ) : (
            <>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={styles.titleInput}
                aria-label="Entry title"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your reflection here…"
                rows={16}
                style={styles.textarea}
                aria-label="Entry text"
              />
              <div style={styles.actions}>
                <button onClick={handleSave} style={styles.btn}>Save</button>
                {active?.id && <button onClick={() => handleDelete(active.id!)} style={{...styles.btn, ...styles.danger}}>Delete</button>}
              </div>
              <div style={styles.note}>Private: data stays in your browser. Clipboard/drag/context disabled in this area.</div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 12, padding: 12, background: 'rgba(10,10,10,0.35)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.08)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  headerLeft: { display: 'flex', alignItems: 'baseline', gap: 8 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  toggleLabel: { display: 'flex', alignItems: 'center', fontSize: 14, opacity: 0.9 },
  passRow: { display: 'flex', gap: 8, alignItems: 'center' },
  passInput: { padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.25)', color: 'inherit' },
  body: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 12, minHeight: 360 },
  sidebar: { display: 'flex', flexDirection: 'column', gap: 8 },
  list: { display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 420 },
  listItem: { textAlign: 'left', padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', position: 'relative' },
  listItemActive: { outline: '2px solid rgba(255,255,255,0.25)' },
  listTitle: { fontWeight: 600, marginBottom: 4 },
  listMeta: { fontSize: 12, opacity: 0.7 },
  badge: { position: 'absolute', top: 8, right: 8, fontSize: 10, opacity: 0.8 },
  editor: { display: 'flex', flexDirection: 'column', gap: 10 },
  titleInput: { padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.25)', color: 'inherit', fontWeight: 600 },
  textarea: { width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.25)', color: 'inherit', resize: 'vertical' },
  actions: { display: 'flex', gap: 8 },
  btn: { padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', cursor: 'pointer' },
  danger: { borderColor: 'rgba(255,100,100,0.35)' },
  subtle: { opacity: 0.7, fontSize: 12 },
  lockNotice: { opacity: 0.85, padding: 12 },
  note: { fontSize: 12, opacity: 0.7, marginTop: 4 }
}

export default ProtectedJournal


