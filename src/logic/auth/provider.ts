export type User = { id: string; email?: string } | null;

export const auth = {
  async current(): Promise<User> {
    // Replace with your real auth provider call; must resolve to null | user
    return null;
  },
};
