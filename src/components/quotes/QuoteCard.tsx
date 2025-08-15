import React from 'react';
import { isQuoteWorked } from '../../logic/content/loader';

type Props = {
  id: string;
  text: string;
  context?: string;
  reflectionPrompt?: string;
  onMark?: ()=>void;
};
export default function QuoteCard({ id, text, context, reflectionPrompt, onMark }: Props) {
  const worked = isQuoteWorked(id);
  return (
    <div className="afw-card" style={{padding:20}}>
      <div style={{opacity:.8, fontSize:14, marginBottom:6}}>Quote</div>
      <div style={{fontSize:22, lineHeight:1.45, marginBottom:16}}>{text}</div>

      {context && <>
        <div style={{opacity:.8, fontSize:14, marginBottom:6}}>Context</div>
        <div style={{opacity:.95, marginBottom:16}}>{context}</div>
      </>}

      {reflectionPrompt && <>
        <div style={{opacity:.8, fontSize:14, marginBottom:6}}>Reflection</div>
        <div style={{opacity:.95}}>{reflectionPrompt}</div>
      </>}

      <div style={{marginTop:16, display:'flex', gap:12, alignItems:'center'}}>
        <input type="checkbox" checked={worked} onChange={onMark} />
        <span>{worked ? 'Worked through' : 'Mark as worked through'}</span>
      </div>
    </div>
  );
}