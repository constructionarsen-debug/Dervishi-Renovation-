import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { isStripeConfigured } from '@/lib/stripe';
import FeatureGateOverlay from '@/components/FeatureGateOverlay';
import { PAYMENTS_ENABLED } from '@/lib/featureFlags';

export default async function OrderPage({ params }) {
  const order = await prisma.order.findUnique({
    where: { accessToken: params.token },
    include: { ebook: true, question: true }
  });
  if (!order) return notFound();

  const stripeCheckoutUrl = `/api/stripe/checkout?token=${order.accessToken}`;

  const statusColor = {
    UNPAID: 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-200',
    PENDING: 'bg-amber-100 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200',
    PAID: 'bg-green-100 text-green-900 dark:bg-green-500/10 dark:text-green-200',
    FAILED: 'bg-red-100 text-red-900 dark:bg-red-500/10 dark:text-red-200',
    CANCELED: 'bg-red-100 text-red-900 dark:bg-red-500/10 dark:text-red-200'
  }[order.paymentStatus];

  return (
    <FeatureGateOverlay
      enabled={PAYMENTS_ENABLED}
      title="Payments"
      message="Stripe payments are temporarily disabled and will be available soon."
    >
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Pagesa</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Ky është linku juaj i pagesës. Ruajeni nëse keni nevojë të ktheheni më vonë.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">ORDER</div>
            <div className="mt-1 text-sm font-extrabold">{order.id}</div>
          </div>
          <div className={`rounded-full px-4 py-2 text-xs font-extrabold ${statusColor}`}>{order.paymentStatus}</div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">LLOJI</div>
            <div className="mt-1 font-extrabold">{order.type === 'QA' ? 'Online Q&A' : 'Ebook'}</div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">SHUMA</div>
            <div className="mt-1 font-extrabold">{order.amountLek.toLocaleString('sq-AL')} Lek</div>
          </div>
        </div>

        {order.type === 'QA' && order.question ? (
          <div className="mt-5 rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">PYETJA JUAJ</div>
            <p className="mt-2">{order.question.message}</p>
          </div>
        ) : null}

        {order.type === 'EBOOK' && order.ebook ? (
          <div className="mt-5 rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">EBOOK</div>
            <div className="mt-2 font-extrabold">{order.ebook.title}</div>
          </div>
        ) : null}

        {order.paymentStatus !== 'PAID' ? (
          <div className="mt-6 space-y-3">
            <a
              href={stripeCheckoutUrl}
              className="block w-full rounded-2xl bg-amber-600 px-5 py-3 text-center text-sm font-extrabold text-white shadow-sm hover:bg-amber-700"
            >
              Paguaj me Stripe
            </a>
            {!isStripeConfigured() ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                Stripe nuk është konfiguruar ende (ENV bosh). Linku sipër nuk do të punojë pa konfigurimin e Stripe.
              </div>
            ) : null}

            <div className="rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
              <b>Shënim:</b> Pagesat janë manuale (pa abonim automatik). Pas konfirmimit të pagesës, statusi do të përditësohet.
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
            Pagesa u konfirmua. Faleminderit!
          </div>
        )}

        {order.paymentStatus === 'PAID' && order.type === 'EBOOK' ? (
          <div className="mt-4">
            <Link
              href={`/download/${order.accessToken}`}
              className="inline-flex rounded-full bg-gray-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-black dark:bg-white dark:text-gray-900"
            >
              Akseso / Shkarko materialin
            </Link>
          </div>
        ) : null}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Për pyetje dhe asistencë, përdorni <Link className="font-semibold text-amber-700 hover:underline dark:text-amber-400" href="/qa">Q&amp;A</Link>.
      </div>
    </div>
    </FeatureGateOverlay>
  );
}
