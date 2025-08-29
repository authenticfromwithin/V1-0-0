import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid'|'ghost';
  small?: boolean;
};
export default function Button({ variant='ghost', small=false, style, ...rest }: Props){
  const base: React.CSSProperties = {
    padding: small ? '4px 8px' : '6px 12px',
    borderRadius: 10,
    border: '1px solid var(--afw-border)',
    background: variant==='solid' ? 'rgba(255,255,255,.06)' : 'transparent',
    color: 'inherit',
    cursor: 'pointer'
  };
  return <button {...rest} style={{...base, ...style}} />;
}
