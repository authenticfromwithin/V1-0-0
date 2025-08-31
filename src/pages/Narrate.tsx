import React from 'react';

type RecState = 'idle'|'recording'|'paused'|'stopped';

function parseVtt(text: string){
  const lines = text.split(/\r?\n/).map(l=>l.trim());
  const content: string[] = [];
  for (const l of lines){
    if (!l || /^WEBVTT/.test(l) || /-->/.test(l) || /^\d+$/.test(l)) continue;
    content.push(l);
  }
  return content.join('\n');
}

export default function Narrate(){
  const [id, setId] = React.useState('2025-03-01');
  const [script, setScript] = React.useState<string>('');
  const [state, setState] = React.useState<RecState>('idle');
  const [blobUrl, setBlobUrl] = React.useState<string>('');
  const chunks = React.useRef<Blob[]>([]);
  const recRef = React.useRef<MediaRecorder|null>(null);
  const streamRef = React.useRef<MediaStream|null>(null);
  const [ext, setExt] = React.useState<'ogg'|'webm'>('ogg');

  React.useEffect(()=>{
    let alive = true;
    fetch(`/narration/captions/${id}.vtt`).then(r=>r.text()).then(t=>{
      if (alive) setScript(parseVtt(t));
    }).catch(()=>setScript('No VTT found. You can still record.'));
    return ()=>{ alive = false; };
  }, [id]);

  const start = async () => {
    if (state === 'recording') return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const mime = (window as any).MediaRecorder && (window as any).MediaRecorder.isTypeSupported
      ? ((MediaRecorder.isTypeSupported('audio/ogg; codecs=opus') && 'audio/ogg; codecs=opus') ||
         (MediaRecorder.isTypeSupported('audio/webm; codecs=opus') && 'audio/webm; codecs=opus') ||
         '')
      : '';
    const mr = new MediaRecorder(stream, { mimeType: mime || undefined, audioBitsPerSecond: 128000 });
    setExt(mime && mime.includes('ogg') ? 'ogg' : 'webm');
    recRef.current = mr;
    chunks.current = [];
    mr.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
    mr.onstop = () => {
      const b = new Blob(chunks.current, { type: mime || 'audio/webm' });
      const url = URL.createObjectURL(b);
      setBlobUrl(url);
      stream.getTracks().forEach(t=>t.stop());
    };
    mr.start();
    setState('recording');
  };

  const stop = () => { const mr = recRef.current; if (!mr) return; mr.stop(); setState('stopped'); };
  const pause = () => { const mr = recRef.current; if (!mr || state!=='recording') return; mr.pause(); setState('paused'); };
  const resume = () => { const mr = recRef.current; if (!mr || state!=='paused') return; mr.resume(); setState('recording'); };
  const reset = () => {
    setState('idle');
    if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(''); }
    chunks.current = [];
    recRef.current = null;
    streamRef.current?.getTracks().forEach(t=>t.stop());
    streamRef.current = null;
  };

  const download = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${id}.${ext}`;
    a.click();
  };

  const nav = (delta: number) => {
    const d = new Date(id);
    d.setDate(d.getDate() + delta);
    const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), da = String(d.getDate()).padStart(2,'0');
    setId(`${y}-${m}-${da}`);
  };

  return (
    <main className="page">
      <h2>Narration Recorder (Offline)</h2>
      <p style={{opacity:.85}}>Record narration per day and download as <code>.ogg</code> (preferred) or <code>.webm</code> depending on your browser. Place the file under <code>public/narration/tracks/</code> with the exact date filename.</p>
      <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
        <button onClick={()=>nav(-1)} title="Previous day">◀</button>
        <input value={id} onChange={e=>setId(e.target.value)} aria-label="Devotional date YYYY-MM-DD" style={{padding:'6px 10px', borderRadius:8, border:'1px solid rgba(255,255,255,.2)', background:'transparent', color:'inherit'}}/>
        <button onClick={()=>nav(+1)} title="Next day">▶</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:12}}>
        <section style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
          <h3 style={{marginTop:0}}>Script</h3>
          <pre className="narrate-script">{script}</pre>
        </section>
        <section style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
          <h3 style={{marginTop:0}}>Recorder</h3>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            {state!=='recording' && state!=='paused' && <button onClick={start}>Start</button>}
            {state==='recording' && <button onClick={pause}>Pause</button>}
            {state==='paused' && <button onClick={resume}>Resume</button>}
            {(state==='recording' || state==='paused') && <button onClick={stop}>Stop</button>}
            {state==='stopped' && <button onClick={reset}>Reset</button>}
            {blobUrl && <button onClick={download}>Download ({ext})</button>}
          </div>
          {blobUrl && <audio controls src={blobUrl} style={{width:'100%', marginTop:8}}/>}
          <p style={{opacity:.8, marginTop:8}}><strong>Save to:</strong> <code>public/narration/tracks/{'{'}{id}{'}'}</code>.{ext}</p>
          <p style={{opacity:.7}}>Tip: For Safari (which prefers MP3), you can convert the downloaded file to MP3 locally using ffmpeg, or rely on device‑TTS fallback.</p>
        </section>
      </div>
    </main>
  );
}


