// null-safe auth provider with a stable API
export type Session = { userId: string, displayName?: string|null } | null;

export async function current(): Promise<Session> {
  try {
    // TODO: wire to real auth; keep null-safe
    return null;
  } catch {
    return null;
  }
}