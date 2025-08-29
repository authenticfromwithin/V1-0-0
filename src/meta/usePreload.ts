import { useEffect } from 'react';

export default function usePreload(images: string[]){
  useEffect(()=>{
    const links: HTMLLinkElement[] = [];
    images.forEach(src => {
      if (!src) return;
      const l = document.createElement('link');
      l.rel = 'preload';
      l.as = 'image';
      l.href = src;
      document.head.appendChild(l);
      links.push(l);
    });
    return ()=> { links.forEach(l => l.remove()); };
  }, [images.join('|')]);
}
