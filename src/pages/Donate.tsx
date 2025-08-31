import React from "react";

export default function Donate() {
  return (
    <main className="min-h-screen relative">
      {/* Lantern-path aesthetic (swap for real plate path when available) */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: 'url("/assets/lantern/path.jpg")' }} />
      <section className="max-w-3xl mx-auto p-6 bg-black/40 backdrop-blur rounded-2xl mt-16">
        <h1 className="text-2xl font-semibold mb-3">Support the Work</h1>
        <p className="opacity-85 mb-4">
          Your donation helps sustain Authentic From Within—hosting, content, and community outreach.
        </p>
        {/* Replace below with your actual donation links/components */}
        <div className="space-y-3">
          <a className="block rounded-lg px-4 py-3 bg-white/10 hover:bg-white/20 transition" href="#" rel="noreferrer">Give via EFT</a>
          <a className="block rounded-lg px-4 py-3 bg-white/10 hover:bg-white/20 transition" href="#" rel="noreferrer">Give via Card</a>
        </div>
      </section>
    </main>
  );
}
