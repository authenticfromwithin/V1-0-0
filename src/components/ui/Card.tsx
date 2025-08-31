import React from 'react';

type Props = { children: React.ReactNode; style?: React.CSSProperties; className?: string };
export default function Card({ children, style, className }: Props){
  return (
    <section className={className} style={{border:'1px solid var(--afw-border)', borderRadius:12, padding:12, ...style}}>
      {children}
    </section>
  );
}




