import React from 'react';
import type { Devotional } from '../../types/content';

export default function DevotionalCard({ title, body, references, dateISO }: Devotional) {
  return (
    <article className="afw-card" style={{padding:20}}>
      <div style={{opacity:.7, fontSize:13}}>{dateISO}</div>
      <h2 style={{margin:'8px 0 12px 0'}}>{title}</h2>
      <p style={{lineHeight:1.7}}>{body}</p>
      {references && references.length > 0 && (
        <div style={{opacity:.8, marginTop:12, fontSize:14}}>Refs: {references.join(', ')}</div>
      )}
    </article>
  );
}