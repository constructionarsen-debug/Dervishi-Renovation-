import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) throw new Error('UNAUTHORIZED');
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error('UNAUTHORIZED');
  return session;
}
