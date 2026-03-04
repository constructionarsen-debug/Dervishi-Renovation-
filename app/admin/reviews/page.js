import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Admin Reviews | Dervishi Renovation' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Stars({ n }) {
  const r = Math.min(5, Math.max(1, n || 5));
  return (
    <div className="text-amber-600 dark:text-amber-400 text-sm">
      {'★★★★★'.slice(0, r)}{'☆☆☆☆☆'.slice(0, 5 - r)}
    </div>
  );
}

export default async function AdminReviewsPage() {
  const [pending, approved] = await Promise.all([
    prisma.review.findMany({ where: { approved: false }, orderBy: { createdAt: 'desc' } }),
    prisma.review.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Reviews</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Aprovo review-t për t’u shfaqur në homepage te “Pse Dervishi Renovation?”.
          </p>
        </div>
        <a
          href="/admin"
          className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
        >
          ← Kthehu te Admin
        </a>
      </div>

      <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h2 className="text-xl font-extrabold">Në pritje (pending)</h2>
        <div className="mt-5 space-y-4">
          {pending.map((r) => (
            <div key={r.id} className="rounded-2xl border border-black/5 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold">{r.firstName} {r.lastName}</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{r.email} • {new Date(r.createdAt).toLocaleString('sq-AL')}</div>
                  <div className="mt-2"><Stars n={r.rating} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <form action="/api/admin/reviews" method="POST">
                    <input type="hidden" name="redirectTo" value="/admin/reviews" />
                    <input type="hidden" name="action" value="approve" />
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-full bg-amber-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-amber-700" type="submit">Aprovo</button>
                  </form>
                  <form action="/api/admin/reviews" method="POST">
                    <input type="hidden" name="redirectTo" value="/admin/reviews" />
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-full bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700" type="submit">Fshi</button>
                  </form>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">{r.content}</p>
            </div>
          ))}
          {!pending.length && (
            <div className="rounded-2xl border border-black/5 bg-gray-50 p-5 text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
              Asnjë review në pritje.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h2 className="text-xl font-extrabold">Të aprovuara (shfaqen në homepage)</h2>
        <div className="mt-5 space-y-4">
          {approved.map((r) => (
            <div key={r.id} className="rounded-2xl border border-black/5 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold">{r.firstName} {r.lastName}</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{new Date(r.createdAt).toLocaleString('sq-AL')}</div>
                  <div className="mt-2"><Stars n={r.rating} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <form action="/api/admin/reviews" method="POST">
                    <input type="hidden" name="redirectTo" value="/admin/reviews" />
                    <input type="hidden" name="action" value="unapprove" />
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900" type="submit">Hiq aprovim</button>
                  </form>
                  <form action="/api/admin/reviews" method="POST">
                    <input type="hidden" name="redirectTo" value="/admin/reviews" />
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-full bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700" type="submit">Fshi</button>
                  </form>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">{r.content}</p>
            </div>
          ))}
          {!approved.length && (
            <div className="rounded-2xl border border-black/5 bg-gray-50 p-5 text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
              Asnjë review e aprovuar ende.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
