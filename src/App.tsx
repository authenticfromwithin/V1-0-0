import React from 'react';
import './styles';
import { PolicyBanner, NoUploadZone, ProtectedJournal, installClipboardGuards } from './guards';
import { QuotesPanel, DevotionalsPanel } from './components';

export default function App() {
  React.useEffect(() => {
    // Guard whole app; journal has its own guard too
    const uninstall = installClipboardGuards();
    return () => uninstall && uninstall();
  }, []);

  return (
    <div style={{minHeight:'100vh', display:'grid', gridTemplateRows:'auto 1fr auto'}}>
      {/* Top */}
      <header style={{padding:16}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{fontSize:18, fontWeight:600}}>Authentic From Within — v1.0</div>
        </div>
        <div style={{marginTop:8}}>
          <PolicyBanner />
        </div>
      </header>

      {/* Content */}
      <main style={{padding:'0 16px 24px 16px', display:'grid', gap:24}}>
        <section aria-label="Quotes">
          <h2 style={{margin:'0 0 10px 0'}}>Quotes</h2>
          <QuotesPanel />
        </section>

        <section aria-label="Devotionals">
          <h2 style={{margin:'0 0 10px 0'}}>Devotionals</h2>
          <DevotionalsPanel />
        </section>

        <section aria-label="Journal">
          <h2 style={{margin:'0 0 10px 0'}}>Private Journal</h2>
          <NoUploadZone>
            <ProtectedJournal rows={10} placeholder="Your private reflection..." />
          </NoUploadZone>
          <div style={{opacity:.65, fontSize:12, marginTop:8}}>Your journal text stays on this device.</div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{padding:16, opacity:.8}}>
        <div>© {new Date().getFullYear()} Authentic From Within</div>
      </footer>
    </div>
  );
}
