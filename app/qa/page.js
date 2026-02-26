import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getUserQaAccess } from '@/lib/qaAccess';
import FeatureGateOverlay from '@/components/FeatureGateOverlay';
import { PAYMENTS_ENABLED } from '@/lib/featureFlags';
import Link from 'next/link';

export const metadata = {
  title: "Shërbimi Online (Q&A) - Konsultë për Renovim",
  description:
    "Bëj pyetje dhe merr udhëzim profesional për renovimin: materiale, buxhet, faza pune, gabime të zakonshme dhe zgjidhje praktike. Shërbim online nga Dervishi Renovation.",
  keywords: [
    "konsulte renovimi online",
    "qa renovim",
    "keshillim interieri",
    "materiale ndertimi",
    "buxhet renovimi",
    "renovim tirane online",
  ],
  alternates: {
    canonical: "/qa",
  },
  openGraph: {
    type: "website",
    locale: "sq_AL",
    url: "/qa",
    title: "Shërbimi Online (Q&A) - Dervishi Renovation",
    description:
      "Konsultë online për renovim: pyetje & përgjigje, udhëzim për materiale, buxhet, plan pune dhe zgjidhje.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Shërbimi Online Q&A" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shërbimi Online (Q&A) - Dervishi Renovation",
    description:
      "Konsultë online për renovim: pyetje & përgjigje, materiale, buxhet, plan pune dhe zgjidhje.",
    images: ["/og-image.png"],
  },
};

export default async function OnlineServicePage() {
  const price = await prisma.priceSetting.findUnique({ where: { key: 'qa_monthly' } });
  const amount = price?.priceLek ?? 2500;

  const session = await auth();
  const userId = session?.user?.id;
  const access = userId ? await getUserQaAccess(userId) : { active: false, activeUntil: null };

  return (
    <FeatureGateOverlay
      enabled={PAYMENTS_ENABLED}
      title="Pagesat online"
      message="Pagesat me kartë do të mundësohen shumë shpejt për ju."
    >
    <div className="grid gap-8 lg:grid-cols-12 mt-10">
      <div className="lg:col-span-5">
        <h1 className="text-3xl font-extrabold">Shërbimi Online (Paid Q&amp;A)</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Bëni pyetjen tuaj dhe merrni një përgjigje direkte nga ekipi. Pagesa është <b>manuale mujore</b>
          (nuk debitohet automatikisht).
        </p>

        <div className="mt-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">ÇMIMI</div>
          <div className="mt-2 text-3xl font-extrabold">{amount.toLocaleString('sq-AL')} Lek</div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{price?.description || 'Pagesë mujore manuale për Q&A dhe konsulta.'}</div>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li>✓ Konfirmim me email</li>
            <li>✓ Udhëzime për pagesën</li>
            <li>✓ Përgjigje direkte</li>
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-black/5 bg-gray-50 p-5 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
          Në fazë të mëvonshme: histori pyetjesh për secilin klient + seksion FAQ për pyetjet më të shpeshta.
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <h2 className="text-xl font-extrabold">Dërgo pyetje</h2>

          {!session?.user ? (
            <div className="mt-5 rounded-2xl border border-black/5 bg-gray-50 p-5 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
              Për të përdorur shërbimin online duhet të jeni të kyçur.
              <div className="mt-4">
                <Link href="/login?from=/qa" className="inline-flex rounded-full bg-gray-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-black dark:bg-white dark:text-gray-900">
                  Login
                </Link>
              </div>
            </div>
          ) : access.active ? (
            <>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Abonimi juaj është aktiv deri më <b>{access.activeUntil.toLocaleDateString('sq-AL')}</b>. Mund të dërgoni pyetje pa pagesë.
              </p>

              <form action="/api/qa/tickets/create" method="POST" className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold">Email</label>
                    <input
                      name="email"
                      type="email"
                      readOnly
                      defaultValue={session.user.email || ''}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-gray-950"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Telefon (opsionale)</label>
                    <input
                      name="phone"
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">Mesazh / Pyetje</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700"
                >
                  Dërgo pyetjen
                </button>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link href="/profile" className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">
                    Shiko ticket-et te profili
                  </Link>
                  <button
                    type="button"
                    disabled
                    className="rounded-2xl bg-gray-200 px-5 py-3 text-sm font-extrabold text-gray-600 dark:bg-white/10 dark:text-gray-300"
                  >
                    Pagesa (aktive)
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Duke vazhduar, pranoni Privacy Policy dhe Terms &amp; Conditions.
                </p>
              </form>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Për të dërguar pyetje, aktivizoni aksesin 30-ditor me pagesë (manuale).
              </p>

              <form action="/api/qa/buy" method="POST" className="mt-6 space-y-4">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700"
                >
                  Paguaj për 30 ditë akses
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pagesa është manuale (pa abonim automatik). Kur të mbarojë afati, e rinovoni vetë.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
    </FeatureGateOverlay>
  );
}
