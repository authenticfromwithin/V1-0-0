import React from 'react'
import { auth } from '@/logic/auth/provider'

type Props = { children: React.ReactNode }

/**
 * Minimal guard for now: if you want to truly block unauthenticated access,
 * replace the return with a redirect when `auth.user` is null.
 */
export default function RequireAuth({ children }: Props) {
  // Example for later:
  // if (!auth.user) return <div>Please sign in</div>
  return <>{children}</>
}





