export type User = {
  id: string
  email?: string
} | null

/**
 * Temporary stub. Replace with your real Supabase auth client when ready.
 * This keeps your app compiling and rendering while you finish wiring auth.
 */
export const auth: { user: User } = {
  user: null
}


