import React from 'react';

export default function Mist(){
  const reduce = React.useMemo(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
  if (reduce) return null;
  return (
    <div aria-hidden className="afw-mist" />
  );
}


