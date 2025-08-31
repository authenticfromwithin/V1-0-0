import React from 'react';
import { attachClipboardGuards } from '@/guards/clipboard';
import { getEphemeralPassphrase } from '@/logic/auth/store';

type Props = { storageKey?: string };

// Simple UTF‑8 <-> base64 helpers
const enc = new TextEncoder();
const dec = new TextDecoder();
const b64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const ub64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

async function deriveKey(pass: string, salt: Uint8Array){
  const base = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations: 120_000, hash:'SHA-256'}, base, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']);
}
async function encrypt(pass: string, plain: string){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(pass, salt);
  const data = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(plain));
  return JSON.stringify({ iv: b64(iv), salt: b64(salt), data: b64(data) });
}
async function decrypt(pass: string, blob: string){
  const { iv, salt, data } = JSON.parse(blob);
  const key = await deriveKey(pass, ub64(salt));
  const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv: ub64(iv)}, key, ub64(data));
  return dec.decode(plain);
}

export default function ProtectedJournal({ storageKey = 'afw:journal' }: Props){
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [encMode, setEncMode] = React.useState<boolean>(() => localStorage.getItem('afw:journal:enc') === '1');
  const [error, setError] = React.useState('');

  const autoPass = React.useMemo(()=> getEphemeralPassphrase() || '', []);

  // Guards
  React.useEffect(()=>{
    if (!rootRef.current) return;
    const g = attachClipboardGuards(rootRef.current,{enableContextMenu:false});
    return ()=>g.teardown();
  },[]);

  // Load
  React.useEffect(()=>{
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const tryAuto = async () => {
      if (raw.startsWith('{') && (encMode || autoPass)) {
        if (autoPass){
          try {
            const plain = await decrypt(autoPass, raw);
            setText(plain);
            return;
          } catch {}
        }
        setText('[Encrypted] Enter passphrase and click Unlock');
      } else {
        setText(raw);
      }
    };
    tryAuto();
  }, [storageKey, encMode, autoPass]);

  const save = async () => {
    try {
      if (encMode && crypto?.subtle) {
        const usePass = (autoPass || pass || '').trim();
        if (!usePass) { setError('Passphrase required'); return; }
        const blob = await encrypt(usePass, text);
        localStorage.setItem(storageKey, blob);
        localStorage.setItem('afw:journal:enc','1');
      } else {
        localStorage.setItem(storageKey, text);
        localStorage.removeItem('afw:journal:enc');
      }
      setError('');
    } catch (e:any) { setError('Save failed'); }
  };

  const unlock = async () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const usePass = (autoPass || pass || '').trim();
      if (!usePass) { setError('Enter passphrase'); return; }
      const plain = await decrypt(usePass, raw);
      setText(plain);
      setError('');
    } catch { setError('Wrong passphrase'); }
  };

  return (
    <div ref={rootRef} className="journal-protected">
      <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
        <label><input type="checkbox" checked={encMode} onChange={(e)=>setEncMode(e.target.checked)} /> Encrypt with passphrase</label>
        {autoPass ? (
          <span style={{opacity:.8}}>Using profile passphrase</span>
        ) : (
          <input type="password" placeholder="Passphrase" value={pass} onChange={(e)=>setPass(e.target.value)}
            style={{padding:'6px 10px', borderRadius:8, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color:'inherit'}}/>
        )}
        <button onClick={unlock} style={{padding:'6px 10px', borderRadius:8}}>Unlock</button>
        <button onClick={save} style={{padding:'6px 10px', borderRadius:8}}>Save</button>
        {error && <span style={{color:'#f99'}}>{error}</span>}
      </div>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write here. This never leaves your device." />
    </div>
  );
}






