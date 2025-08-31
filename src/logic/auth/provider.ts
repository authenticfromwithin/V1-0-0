/**
 * Null-safe auth provider shim.
 * Exported API: async function current(): Promise<User|null>
 */
export type User = { id: string; email?: string|null; name?: string|null };

export async function current(): Promise<User | null> {
  try {
    // TODO: wire to real provider; keep null-safe for now.
    return null;
  } catch (_e) {
    return null;
  }
}

// Also provide default for legacy imports
export default { current };