import React from 'react';
import { listProfiles, createProfile, unlockProfile, getActiveProfile, removeProfile, lockProfile } from '@/logic/auth/store';

export default function AuthPanel(){
  const [profiles, setProfiles] = React.useState(()=>listProfiles());
  const [mode, setMode] = React.useState<'signin'|'signup'>('signin');
  const [active, setActive] = React.useState(()=>getActiveProfile());
  const [error, setError] = React.useState('');

  React.useEffect(()=>{ setProfiles(listProfiles()); setActive(getActiveProfile()); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError('');
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name')||'').trim();
    const pass = String(fd.get('pass')||'');
    const pass2 = String(fd.get('pass2')||'');
    const pronouns = String(fd.get('pronouns')||'').trim() || undefined;
    const theme = (String(fd.get('theme')||'forest') as any);
    const healing = (String(fd.get('healing')||'A') as any);
    const journey = (String(fd.get('journey')||'A') as any);
    const consent = !!fd.get('consent');
    if (!name || !pass || pass !== pass2){ setError('Enter name and matching passphrases'); return; }
    await createProfile(name, pass, { pronouns, theme, healing, journey, consentLocalMetrics: consent });
    setProfiles(listProfiles()); setMode('signin'); (e.currentTarget as any).reset();
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError('');
    const fd = new FormData(e.currentTarget);
    const id = String(fd.get('id')||'');
    const pass = String(fd.get('pass')||'');
    try{ await unlockProfile(id, pass); setActive(getActiveProfile()); }
    catch(err:any){ setError(err?.message === 'bad-passphrase' ? 'Wrong passphrase' : 'Sign-in failed'); }
  };

  const onRemove = (id: string) => {
    if (!confirm('Remove this profile from this device? This will not affect any other device.')) return;
    removeProfile(id); setProfiles(listProfiles()); setActive(getActiveProfile());
  };

  const onSignOut = () => { lockProfile(); setActive(getActiveProfile()); };

  return (
    <section aria-labelledby="auth-title" style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 id="auth-title" style={{margin:0}}>Your Space</h3>
        {active ? <button onClick={onSignOut} style={{padding:'6px 10px', borderRadius:8}}>Sign out</button> : null}
      </div>

      {active ? (
        <p style={{marginTop:8, opacity:.9}}>Signed in locally as <strong>{active.name}</strong>. Your journal stays private on this device.</p>
      ) : (
        <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:8}}>
          <button onClick={()=>setMode('signin')} aria-pressed={mode==='signin'} style={{padding:'6px 10px', borderRadius:8}}>Sign in</button>
          <button onClick={()=>setMode('signup')} aria-pressed={mode==='signup'} style={{padding:'6px 10px', borderRadius:8}}>Create profile</button>
        </div>
      )}

      {!active && mode==='signin' && (
        <form onSubmit={handleSignIn} style={{marginTop:10, display:'grid', gap:8}}>
          <label>Profile
            <select name="id" required style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}>
              <option value="">Select…</option>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label>Passphrase
            <input name="pass" type="password" required style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}/>
          </label>
          <div style={{display:'flex', gap:8}}>
            <button type="submit" style={{padding:'6px 10px', borderRadius:8}}>Sign in</button>
            {profiles.length>0 && <button type="button" onClick={()=>onRemove((document.querySelector('select[name=id]') as HTMLSelectElement)?.value)} style={{padding:'6px 10px', borderRadius:8}}>Remove</button>}
          </div>
        </form>
      )}

      {!active && mode==='signup' && (
        <form onSubmit={handleCreate} style={{marginTop:10, display:'grid', gap:8}}>
          <label>Name
            <input name="name" type="text" required placeholder="Your first name" style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}/>
          </label>
          <label>Pronouns (optional)
            <input name="pronouns" type="text" placeholder="she/her, he/him, they/them" style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}/>
          </label>
          <label>Preferred Theme
            <select name="theme" defaultValue="forest" style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}>
              <option value="forest">Night Forest</option>
              <option value="ocean">Ocean</option>
              <option value="mountain">Mountain</option>
              <option value="autumn">Autumn</option>
              <option value="snow">Snow</option>
            </select>
          </label>
          <fieldset style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, border:'1px solid rgba(255,255,255,.15)', borderRadius:8, padding:8}}>
            <legend>Appearance</legend>
            <label>Healing
              <select name="healing" defaultValue="A" style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}>
                <option value="A">Variant A</option>
                <option value="B">Variant B</option>
              </select>
            </label>
            <label>Journey
              <select name="journey" defaultValue="A" style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}>
                <option value="A">Variant A</option>
                <option value="B">Variant B</option>
              </select>
            </label>
          </fieldset>
          <label style={{display:'flex', gap:8, alignItems:'center'}}>
            <input name="consent" type="checkbox" defaultChecked /> Allow private, on-device activity metrics (to personalize mood/audio).
          </label>
          <label>Passphrase
            <input name="pass" type="password" required style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}/>
          </label>
          <label>Confirm
            <input name="pass2" type="password" required style={{width:'100%', padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}/>
          </label>
          <button type="submit" style={{padding:'6px 10px', borderRadius:8}}>Create profile</button>
          <p style={{opacity:.75, fontSize:12}}>Profiles are local to this device. Your passphrase never leaves your browser.</p>
        </form>
      )}

      {error && <p style={{color:'#f99', marginTop:8}}>{error}</p>}
    </section>
  );
}



