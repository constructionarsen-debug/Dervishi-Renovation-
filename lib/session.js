import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export function getAppSession() {
  return getServerSession(authOptions);
}
