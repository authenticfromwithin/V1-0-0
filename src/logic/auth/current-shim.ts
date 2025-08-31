// src/logic/auth/current-shim.ts
// Provides a single stable API: getCurrentSafe()
// It adapts to different provider export shapes without breaking builds.
export async function getCurrentSafe(): Promise<any | null> {
  try {
    const mod: any = await import("./provider");
    const candidates = [
      "current",
      "getCurrent",
      "getUser",
      "getSession",
      "me",
      "user",
      "currentUser",
    ];
    for (const key of candidates) {
      const fn = mod?.[key];
      if (typeof fn === "function") {
        try { return await fn(); } catch {}
      }
    }
    // default export might be a function returning the user/session
    if (typeof mod?.default === "function") {
      try { return await mod.default(); } catch {}
    }
  } catch {}
  return null;
}
