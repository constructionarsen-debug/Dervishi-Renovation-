import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Admin Ticket | Dervishi Renovation' };

export default async function AdminTicketPage({ params }) {
  const ticket = await prisma.question.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  });
  if (!ticket) return notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Ticket (Admin)</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Status: <b>{ticket.status}</b> • {ticket.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/qa" className="inline-flex rounded-full bg-gray-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-black dark:bg-white dark:text-gray-900">
            Të gjitha ticket-et
          </Link>

          <form action="/api/admin/questions/status" method="POST">
            <input type="hidden" name="id" value={ticket.id} />
            <input type="hidden" name="redirectTo" value={`/admin/qa/${ticket.id}`} />
            <input type="hidden" name="status" value={ticket.status === 'CLOSED' ? 'OPEN' : 'CLOSED'} />
            <button
              type="submit"
              className="inline-flex rounded-full bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700"
            >
              {ticket.status === 'CLOSED' ? 'Rihap Ticket' : 'Mbyll Ticket'}
            </button>
          </form>
        </div>
      </div>

      <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">Biseda</div>
        <div className="mt-4 space-y-3">
          {ticket.messages.map((m) => (
            <div
              key={m.id}
              className={
                m.sender === 'USER'
                  ? 'rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-200'
                  : 'rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200'
              }
            >
              <div className="text-xs font-bold opacity-70">{m.sender} • {new Date(m.createdAt).toLocaleString('sq-AL')}</div>
              <div className="mt-2 whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
        </div>

        <form action="/api/admin/questions" method="POST" className="mt-6 space-y-3">
          <input type="hidden" name="id" value={ticket.id} />
          <input type="hidden" name="redirectTo" value={`/admin/qa/${ticket.id}`} />
          <textarea
            name="answer"
            required
            rows={5}
            placeholder="Shkruaj përgjigjen…"
            className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
          />
          <button className="w-full rounded-2xl bg-gray-900 px-5 py-3 text-sm font-extrabold text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" type="submit">
            Dërgo përgjigje
          </button>
        </form>
      </section>
    </div>
  );
}
