import React from "react";

/** Survey-only placeholder.
 * Present in code, hidden from header/nav at launch.
 * Keep route as /heavenly for future enablement.
 */
export default function HeavenlyExpress() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-black/40 rounded-2xl p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold mb-2">Heavenly Express — Survey</h1>
        <p className="opacity-80 mb-4">
          This feature is present in code but intentionally hidden at launch. Only the survey is enabled.
        </p>
        <form className="space-y-3">
          <label className="block">
            <span className="text-sm">How likely are you to use Heavenly Express?</span>
            <select className="w-full mt-1 rounded-md bg-black/30 p-2">
              <option>Very likely</option>
              <option>Likely</option>
              <option>Unsure</option>
              <option>Unlikely</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm">Comments</span>
            <textarea className="w-full mt-1 rounded-md bg-black/30 p-2" rows={4} placeholder="Your thoughts..." />
          </label>
          <button type="button" className="rounded-lg px-4 py-2 bg-white/10 hover:bg-white/20 transition">
            Submit (stub)
          </button>
        </form>
      </div>
    </main>
  );
}
