import React from 'react';

const LINES = [
  'Breathe. You are here.',
  'Let the shoulders soften.',
  'Quiet is not empty. It is full.',
  'Every step is a prayer.',
  'Kindness begins within.'
];

export default function MicroAffirmations({ mood }:{ mood:number }){
  const idx = Math.max(0, Math.min(LINES.length-1, Math.round(((mood+1)/2)*(LINES.length-1))));
  return <p style={{opacity:.85, marginTop:8}}>{LINES[idx]}</p>;
}




