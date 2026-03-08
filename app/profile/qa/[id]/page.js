import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const metadata = { title: 'Ticket' };

export default async function TicketPage({ params }) {
  const session = await auth();
  const email = session?.user?.email ? String(session.user.email).toLowerCase() : '';
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (!user) return notFound();

  const ticket = await prisma.question.findFirst({
    where: { id: params.id, userId: user.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  });
  if (!ticket) return notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Ticket</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Status: <b>{ticket.status}</b></p>
        </div>
        <Link href="/profile" className="inline-flex rounded-full bg-gray-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-black dark:bg-white dark:text-gray-900">
          Kthehu te profili
        </Link>
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
              <div className="text-xs font-bold opacity-70">{m.sender === 'USER' ? 'Ju' : 'Admin'} • {new Date(m.createdAt).toLocaleString('sq-AL')}</div>
              <div className="mt-2 whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
        </div>

        {ticket.status === 'CLOSED' ? (
          <div className="mt-6 rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
            Ky ticket është <b>CLOSED</b> nga admini dhe nuk mund të dërgoni më mesazhe.
          </div>
        ) : (
          <form action="/api/qa/tickets/message" method="POST" className="mt-6 space-y-3">
            <input type="hidden" name="ticketId" value={ticket.id} />
            <textarea
              name="content"
              required
              rows={4}
              placeholder="Shto një mesazh…"
              className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
            />
            <button className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700" type="submit">
              Dërgo mesazh
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
