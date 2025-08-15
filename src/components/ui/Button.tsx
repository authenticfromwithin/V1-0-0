import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary'|'ghost';
  small?: boolean;
};
export default function Button({ variant='primary', small=false, className='', ...rest }: Props) {
  const base = 'afw-card';
  const pad = small ? 'px-3 py-1 text-sm' : 'px-4 py-2';
  const style = variant==='primary'
    ? 'border border-white/10 hover:border-white/20'
    : 'bg-transparent border border-white/10 hover:border-white/20';
  return (
    <button {...rest} className={`${base} ${pad} ${style} ${className}`.trim()} />
  );
}