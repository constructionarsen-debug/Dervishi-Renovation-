import { requireAdmin } from '@/lib/auth-helpers';

export default async function AdminLayout({ children }) {
  await requireAdmin();
  return <>{children}</>;
}
