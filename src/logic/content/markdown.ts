export function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let inList = false;
  const flushP = (buf: string[]) => {
    if (!buf.length) return;
    out.push('<p>' + buf.join(' ').trim() + '</p>');
    buf.length = 0;
  };
  const pbuf: string[] = [];
  for (let i=0;i<lines.length;i++){
    const line = lines[i];
    if (/^\s*$/.test(line)) { flushP(pbuf); continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flushP(pbuf);
      const level = h[1].length;
      out.push(`<h${level}>${escapeHtml(h[2])}</h${level}>`);
      continue;
    }
    const li = /^[-*]\s+(.*)$/.exec(line);
    if (li){
      flushP(pbuf);
      if (!inList) { inList = true; out.push('<ul>'); }
      out.push('<li>' + escapeHtml(li[1]) + '</li>');
      if (i+1<lines.length && !/^[-*]\s+/.test(lines[i+1])) { out.push('</ul>'); inList = false; }
      continue;
    }
    pbuf.push(escapeHtml(line));
  }
  flushP(pbuf);
  if (inList) out.push('</ul>');
  return out.join('\n');
}
function escapeHtml(s: string){ return s.replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m] as string)); }
