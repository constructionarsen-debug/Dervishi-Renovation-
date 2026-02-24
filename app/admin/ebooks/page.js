import { prisma } from '@/lib/prisma';
import AdminEbookForm from '@/components/AdminEbookForm';

export default async function AdminEbooks() {
  const ebooks = await prisma.ebook.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <main className="container-pad">
      <h1 className="text-3xl font-extrabold">Ebooks</h1>
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="card p-8">
          <h2 className="text-xl font-extrabold">Krijo Ebook</h2>
          <AdminEbookForm />
        </div>
        <div className="card p-8">
          <h2 className="text-xl font-extrabold">Lista</h2>
          <div className="mt-4 space-y-3">
            {ebooks.map((e) => (
              <div key={e.id} className="rounded-2xl border border-gray-200/70 dark:border-zinc-800/70 p-4">
                <div className="font-extrabold">{e.title}</div>
                <div className="text-xs text-gray-600 dark:text-zinc-300">/{e.slug} • {(e.priceCents/100).toFixed(2)} {e.currency}</div>
              </div>
            ))}
            {!ebooks.length && <div className="text-sm text-gray-600 dark:text-zinc-300">Asnjë ebook ende.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
