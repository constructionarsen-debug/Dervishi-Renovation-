import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminSignOut from '@/components/AdminSignOut';

export const metadata = { title: 'Admin Q&A | Dervishi Renovation' };

export default async function AdminQaPage() {
  const tickets = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      user: { select: { id: true, email: true, name: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Q&amp;A Tickets</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Shikoni dhe përgjigjuni ticket-eve.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="inline-flex rounded-full bg-gray-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-black dark:bg-white dark:text-gray-900">
            Admin Home
          </Link>
          <AdminSignOut />
        </div>
      </div>

      <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-extrabold text-gray-600 dark:text-gray-300">
              <tr>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Klienti</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Përmbledhje</th>
                <th className="py-2 pr-4">Veprim</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {tickets.map((t) => (
                <tr key={t.id} className="border-t border-black/5 dark:border-white/10">
                  <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{new Date(t.createdAt).toLocaleString('sq-AL')}</td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold">{t.user?.name || t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.email}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-gray-800 dark:bg-gray-950 dark:text-gray-200">{t.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-200">{(t.messages?.[0]?.content || t.message).slice(0, 80)}{(t.messages?.[0]?.content || t.message).length > 80 ? '…' : ''}</td>
                  <td className="py-3 pr-4">
                    <Link href={`/admin/qa/${t.id}`} className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">Hap</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
