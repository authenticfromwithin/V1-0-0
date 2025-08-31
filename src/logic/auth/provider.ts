export type User = { id: string; email?: string } | null;

export const auth = {
  async current(): Promise<User> {
    // Replace with real provider when available
    return null;
  },
};
