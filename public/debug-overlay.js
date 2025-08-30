(function () {
  try {
    var qs = new URLSearchParams(location.search);
    if (!qs.has('afwdebug')) return;
    var el = document.createElement('div');
    el.id = 'afw-debug-overlay';
    el.style.position = 'fixed';
    el.style.right = '12px';
    el.style.bottom = '12px';
    el.style.maxWidth = '38rem';
    el.style.zIndex = '99999';
    el.style.background = 'rgba(0,0,0,.85)';
    el.style.color = '#fff';
    el.style.font = '12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
    el.style.padding = '10px 12px';
    el.style.borderRadius = '10px';
    el.style.boxShadow = '0 8px 20px rgba(0,0,0,.35)';
    el.innerHTML = '<strong>AFW Debug:</strong> open DevTools console for full stack traces. <button id="afwdbg-close" style="margin-left:8px;padding:2px 6px;">hide</button>';
    document.documentElement.appendChild(el);
    document.getElementById('afwdbg-close').onclick = function(){ el.remove(); };
    window.addEventListener('error', function (e) {
      console.error('[AFW DEBUG] Window error:', e.error || e.message || e);
    });
    window.addEventListener('unhandledrejection', function (e) {
      console.error('[AFW DEBUG] Unhandled promise rejection:', e.reason || e);
    });
  } catch (e) {
    console.warn('[AFW DEBUG] overlay init failed:', e);
  }
})();
