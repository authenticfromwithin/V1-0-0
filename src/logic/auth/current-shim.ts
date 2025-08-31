/**
 * Stable wrapper around whatever your auth provider exports.
 * Usage: const me = await getCurrentSafe(); // null-safe
 */
export async function getCurrentSafe<T = any>(): Promise<T | null> {
  try {
    // Alias path as agreed in repo config
    const mod: any = await import('@/logic/auth/provider');

    // Try the common shapes in order
    const candidates = [
      mod?.current,
      mod?.getCurrent,
      mod?.default,
      mod?.auth?.current,
    ];

    for (const c of candidates) {
      if (typeof c === 'function') {
        try { return await c(); } catch { /* fallthrough */ }
      } else if (c && typeof c.then === 'function') {
        try { return await c; } catch { /* fallthrough */ }
      } else if (c !== undefined) {
        return c as T;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export default getCurrentSafe;
