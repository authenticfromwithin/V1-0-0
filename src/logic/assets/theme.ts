export function initTheme(){
  const key = 'afw:theme';
  const el = document.documentElement;
  const saved = localStorage.getItem(key);
  if (saved) el.setAttribute('data-theme', saved);
  const obs = new MutationObserver(()=>{
    const t = el.getAttribute('data-theme') || '';
    if (t) localStorage.setItem(key, t); else localStorage.removeItem(key);
  });
  obs.observe(el, { attributes:true, attributeFilter:['data-theme'] });
}




