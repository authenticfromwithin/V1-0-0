import { useEffect } from 'react';

function setMeta(name: string, content: string){
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el){
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOG(property: string, content: string){
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el){
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function useSeo(opts: { title?: string; description?: string; url?: string; image?: string; }){
  useEffect(()=>{
    if (opts.title) document.title = opts.title;
    if (opts.description) setMeta('description', opts.description);
    if (opts.image) setMeta('twitter:card', 'summary_large_image');
    if (opts.image) setMeta('twitter:image', opts.image);
    if (opts.title) setMeta('twitter:title', opts.title);
    if (opts.description) setMeta('twitter:description', opts.description);
    if (opts.image) setOG('og:image', opts.image);
    if (opts.title) setOG('og:title', opts.title);
    if (opts.description) setOG('og:description', opts.description);
    if (opts.url) setOG('og:url', opts.url);
  }, [opts.title, opts.description, opts.url, opts.image]);
}




