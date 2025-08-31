// Null-safe auth shim so imports never break builds.
// Replace with real provider when backend is live.
export type User = { id?: string|null; name?: string|null };

export async function current(): Promise<User|null> { return null; }
export async function signIn(): Promise<void> { /* no-op */ }
export async function signOut(): Promise<void> { /* no-op */ }
