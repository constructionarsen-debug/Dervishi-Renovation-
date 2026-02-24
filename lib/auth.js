import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// Unified auth exports used across the codebase.
// - `authOptions` for NextAuth route handler
// - `auth()` helper for server components / route handlers

export { authOptions };

export function auth() {
  return getServerSession(authOptions);
}
