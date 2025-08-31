import React from 'react';
import Card from 'components/ui/Card';

type Section = { id: string; title: string; file?: string };
type GuideManifest = { sections: Section[] } | Section[];

async function loadManifest(): Promise<Section[]> {
  try {
    const mf = await fetch('/content/guide.manifest.json').then(r=>r.json()) as GuideManifest;
    if (Array.isArray(mf)) return mf;
    if (mf.sections) return mf.sections;
  } catch {}
  return [];
}
async function fetchMd(file: string): Promise<string>{
  try {
    const url = file.startsWith('/') ? file : '/content/guide/sections/' + file;
    const txt = await fetch(url).then(r=>r.text());
    return txt;
  } catch { return '# Missing\nContent not found.'; }
}

// Tiny inline Markdown renderer (headings, paragraphs, **bold**, *italic*)
function mdInline(s: string){
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
function renderMarkdown(md: string){
  const lines = md.replace(/\r\n/g,'\n').split('\n');
  const out: React.ReactNode[] = [];
  let para: string[] = [];
  const flushPara = () => {
    if (para.length){
      const html = mdInline(para.join(' '));
      out.push(<p key={'p'+out.length} dangerouslySetInnerHTML={{__html: html}}/>);
      para = [];
    }
  };
  lines.forEach((ln) => {
    if (ln.startsWith('### ')){ flushPara(); out.push(<h3 key={'h3'+out.length}>{ln.slice(4)}</h3>); return; }
    if (ln.startsWith('## ')){ flushPara(); out.push(<h2 key={'h2'+out.length}>{ln.slice(3)}</h2>); return; }
    if (ln.startsWith('# ')){ flushPara(); out.push(<h1 key={'h1'+out.length}>{ln.slice(2)}</h1>); return; }
    if (ln.trim()===''){ flushPara(); return; }
    para.push(ln.trim());
  });
  flushPara();
  return out;
}

export default function Guide(){
  const [sections, setSections] = React.useState<Section[]>([]);
  const [active, setActive] = React.useState<Section | null>(null);
  const [body, setBody] = React.useState<string>('');

  React.useEffect(()=>{
    let ok = true;
    loadManifest().then(s => {
      if (!ok) return;
      setSections(s);
      if (s.length) setActive(s[0]);
    });
    return ()=>{ ok = false; };
  }, []);

  React.useEffect(()=>{
    let ok = true;
    if (!active) { setBody(''); return; }
    const file = active.file || `/${'content/guide/sections/' + active.id + '.md'}`;
    fetchMd(file).then(txt => { if (ok) setBody(txt); });
    return ()=>{ ok = false; };
  }, [active?.id]);

  return (
    <main className="page">
      <h2>Guide</h2>
      {sections.length === 0 ? (
        <Card><p className="afw-muted">No guide sections found. Add <code>/public/content/guide.manifest.json</code> and markdown files in <code>/public/content/guide/sections/</code>.</p></Card>
      ) : (
        <div className="guide-wrap">
          <nav className="guide-nav" aria-label="Guide sections">
            <ul>
              {sections.map(s => (
                <li key={s.id}>
                  <a href="#" onClick={(e)=>{e.preventDefault(); setActive(s);}}
                     aria-current={active?.id===s.id ? 'true' : 'false'}>{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <article className="guide-reader">
            {body ? renderMarkdown(body) : <p className="afw-muted">Loading…</p>}
          </article>
        </div>
      )}
    </main>
  );
}




