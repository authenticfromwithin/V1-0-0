(function () {
  var params = new URLSearchParams(location.search);
  var enabled = params.has('afwdebug') || sessionStorage.getItem('AFW_DEBUG') === '1';
  if (enabled) {
    window.__AFW_DEBUG = true;
    sessionStorage.setItem('AFW_DEBUG', '1');
  }
  var queue = [];
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
    });
  }
  function render() {
    if (!enabled) return;
    var id = 'afw-debug-overlay';
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.style.position = 'fixed';
      el.style.inset = '1rem';
      el.style.background = 'rgba(0,0,0,0.85)';
      el.style.color = '#fff';
      el.style.zIndex = '2147483647';
      el.style.padding = '1rem';
      el.style.overflow = 'auto';
      el.style.borderRadius = '12px';
      el.style.font = '14px/1.4 system-ui,Segoe UI,Roboto,Helvetica,Arial';
      document.body.appendChild(el);
    }
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
      + '<strong>AFW Debug Overlay</strong>'
      + '<button id="afw-close" style="background:#333;border:1px solid #666;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer">Close</button>'
      + '</div>';
    html += queue.map(function (it, i) {
      return '<div style="margin:8px 0;padding:8px;border:1px solid #555;border-radius:8px;background:#111">'
        + '<div style="color:#f88;font-weight:600">#' + (i+1) + ' ' + escapeHtml(it.err) + '</div>'
        + '<pre style="white-space:pre-wrap;margin:6px 0 0;opacity:.9">'
        + escapeHtml((it.stack || '') + '\n' + (it.info || ''))
        + '</pre></div>';
    }).join('');
    el.innerHTML = html;
    var close = document.getElementById('afw-close');
    if (close) close.onclick = function () { el.remove(); };
  }
  window.__AFW_PUSH_ERROR = function (err, info) {
    if (!enabled) return;
    try {
      queue.push({
        err: String(err && err.message || err || 'Unknown error'),
        stack: (err && err.stack) || '',
        info: (info && info.componentStack) || ''
      });
      render();
    } catch (e) {}
  };
  window.addEventListener('error', function (e) {
    window.__AFW_PUSH_ERROR(e.error || e.message || 'Unknown error');
  });
  window.addEventListener('unhandledrejection', function (e) {
    window.__AFW_PUSH_ERROR(e.reason || 'Unhandled promise rejection');
  });
})();