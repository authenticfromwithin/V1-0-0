// Minimal offline shell: caches app frame only (no content or media).
const CACHE = 'afw-shell-v1';
const CORE = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(()=> self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k))))
      .then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Never cache journals or content; pass-through.
  if (url.pathname.startsWith('/content/') || url.pathname.startsWith('/assets/avatars/')) return;

  // For navigation requests, serve index.html from cache (SPA fallback).
  if (e.request.mode === 'navigate'){
    e.respondWith(
      caches.match('/index.html').then(r => r || fetch('/index.html'))
    );
    return;
  }

  // For core files, cache-first.
  if (CORE.includes(url.pathname)){
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  }
});
