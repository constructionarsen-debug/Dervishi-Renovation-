import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getUserQaAccess } from '@/lib/qaAccess';

function initials(nameOrEmail) {
  const s = String(nameOrEmail || '').trim();
  if (!s) return 'U';
  const parts = s.includes('@') ? s.split('@')[0].split(/[._\-\s]+/) : s.split(/\s+/);
  const a = (parts[0] || 'U')[0] || 'U';
  const b = (parts[1] || '')[0] || '';
  return (a + b).toUpperCase();
}

export const metadata = { title: 'Profili' };

export default async function ProfilePage() {
  const session = await auth();
  const email = session?.user?.email ? String(session.user.email).toLowerCase() : '';
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (!user) {
    // middleware should redirect, but keep safe.
    return null;
  }

  const [orders, tickets, ebookAccess, access] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, include: { ebook: true } }),
    prisma.question.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, include: { messages: { orderBy: { createdAt: 'asc' } } } }),
    prisma.ebookAccess.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, include: { ebook: true } }),
    getUserQaAccess(user.id)
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Profili</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Të dhënat tuaja dhe historiku i blerjeve / ticket-eve.</p>
        </div>
        <Link href="/qa" className="inline-flex rounded-full bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700">
          Shko te Q&amp;A
        </Link>
      </div>

      <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-gray-50 text-lg font-extrabold text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
            {initials(user.name || user.email)}
          </div>
          <div className="min-w-[220px]">
            <div className="text-lg font-extrabold">{user.name || 'User'}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
          </div>
          <div className="ml-auto rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">Q&amp;A AKSES</div>
            {access.active ? (
              <div className="mt-1 font-extrabold">Aktiv deri më {access.activeUntil.toLocaleDateString('sq-AL')}</div>
            ) : (
              <div className="mt-1 font-extrabold">Jo aktiv</div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-extrabold">Ticket-et (Q&amp;A)</h2>
          <Link href="/qa" className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">Krijo ticket</Link>
        </div>

        {tickets.length === 0 ? (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">Nuk keni ticket-e ende.</div>
        ) : (
          <div className="mt-5 space-y-4">
            {tickets.map((t) => (
              <Link key={t.id} href={`/profile/qa/${t.id}`} className="block rounded-2xl border border-black/5 bg-gray-50 p-5 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold">{t.message.slice(0, 80)}{t.message.length > 80 ? '…' : ''}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{new Date(t.createdAt).toLocaleString('sq-AL')}</div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-gray-800 dark:bg-gray-950 dark:text-gray-200">
                    {t.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h2 className="text-xl font-extrabold">Historiku i pagesave</h2>
        {orders.length === 0 ? (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">Nuk keni pagesa.</div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs font-extrabold text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Tipi</th>
                  <th className="py-2 pr-4">Shuma</th>
                  <th className="py-2 pr-4">Statusi</th>
                  <th className="py-2 pr-4">Link</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-black/5 dark:border-white/10">
                    <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleString('sq-AL')}</td>
                    <td className="py-3 pr-4 font-semibold">{o.type}{o.ebook?.title ? ` • ${o.ebook.title}` : ''}</td>
                    <td className="py-3 pr-4 font-extrabold">{o.amountLek.toLocaleString('sq-AL')} Lek</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-extrabold text-gray-800 dark:bg-white/10 dark:text-gray-200">{o.paymentStatus}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <Link href={`/payment/order/${o.accessToken}`} className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">Hap</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h2 className="text-xl font-extrabold">Ebook-et e blera</h2>
        {ebookAccess.length === 0 ? (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">Nuk keni blerë ebook ende.</div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {ebookAccess.map((a) => (
              <Link key={a.id} href={`/ebooks/${a.ebook.slug}/content`} className="rounded-2xl border border-black/5 bg-gray-50 p-5 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="text-sm font-extrabold">{a.ebook.title}</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Akses: {new Date(a.createdAt).toLocaleDateString('sq-AL')}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
