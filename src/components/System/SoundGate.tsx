import React, { useEffect, useState } from 'react';

/**
 * SoundGate
 * - Shows a minimal "Enable sound" button until the user clicks/taps
 * - On first interaction, tries to play an ambient loop (fire crackle / wind) from your /assets folder
 * - If a source fails, it falls back to the next candidate
 */
export default function SoundGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user interacted elsewhere on the page and audio policy is already unlocked, mark as unlocked
    const onAnyInteract = () => {
      // We don't try to auto-play here; we only hide gate if already playing
      // This keeps us compliant with autoplay restrictions.
    };
    window.addEventListener('pointerdown', onAnyInteract, { once: true });
    return () => window.removeEventListener('pointerdown', onAnyInteract);
  }, []);

  const handleEnable = async () => {
    setError(null);
    const candidates = [
      '/assets/audio/fire/crackle.mp3',
      '/assets/audio/fire/crackle.ogg',
      '/assets/audio/forest/stems/wind.mp3'
    ];

    let started = false;
    for (const url of candidates) {
      try {
        const a = new Audio(url);
        a.loop = true;
        a.volume = 0.35;
        // Try to play; if it fails, move to next candidate
        await a.play();
        // Keep a reference on window so it doesn't get GC'd
        // @ts-ignore
        window.__AFW_AMBIENT__ = a;
        started = true;
        break;
      } catch (e) {
        // Try the next one
        console.warn('[SoundGate] Failed to play', url, e);
      }
    }
    if (!started) {
      setError('Could not start ambient audio (files missing or blocked).');
      return;
    }
    setUnlocked(true);
  };

  if (unlocked) return null;

  return (
    <div
      className="afw-soundgate"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,.2))',
        zIndex: 50
      }}
      aria-label="Enable ambient sound"
    >
      <div
        style={{display:'grid', gap:12, placeItems:'center', padding:24, borderRadius:16, background:'rgba(0,0,0,0.35)', border:'1px solid rgba(255,255,255,0.15)'}}
      >
        <div style={{color:'#fff', fontSize:18, fontWeight:600}}>Enable cinematic sound?</div>
        <button
          onClick={handleEnable}
          style={{padding:'12px 18px', borderRadius:999, border:'1px solid rgba(255,255,255,0.2)', background:'#111', color:'#fff', fontSize:16, cursor:'pointer'}}
        >
          Enable sound
        </button>
        {error ? <div style={{color:'#f99', fontSize:12}}>{error}</div> : null}
        <div style={{color:'#ccc', fontSize:12, opacity:.8}}>Required due to browser autoplay policy</div>
      </div>
    </div>
  );
}
