import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import FeatureGateOverlay from '@/components/FeatureGateOverlay';
import { PAYMENTS_ENABLED } from '@/lib/featureFlags';

export default async function EbookDetailPage({ params }) {
  const ebook = await prisma.ebook.findUnique({ where: { slug: params.slug } });
  if (!ebook || !ebook.isActive) return notFound();

  return (
    <FeatureGateOverlay
      enabled={PAYMENTS_ENABLED}
      title="Payments"
      message="Stripe payments for Ebooks will be enabled soon. For now, this section is temporarily disabled."
    >
    <div className="grid gap-8 lg:grid-cols-12 mt-10">
      <div className="lg:col-span-5">
        <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft dark:border-white/10 dark:bg-gray-900">
          <div className="relative h-[420px] w-full">
            <Image
              src={ebook.coverImage || 'https://images.unsplash.com/photo-1455885666463-1e1967e36a5f?auto=format&fit=crop&w=1600&q=80'}
              alt={ebook.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 520px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-5 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">ÇMIMI</div>
          <div className="mt-2 text-3xl font-extrabold">{ebook.priceLek.toLocaleString('sq-AL')} Lek</div>
          <form action="/api/ebooks/buy" method="POST" className="mt-5 space-y-3">
            <input type="hidden" name="slug" value={ebook.slug} />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Për të blerë dhe për të ruajtur blerjen në <b>Bibliotekë</b>, kërkohet llogari.
            </p>
            <button className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-amber-700">
              Bli tani
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7">
        <h1 className="text-3xl font-extrabold">{ebook.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{ebook.shortDesc}</p>

        {ebook.longDesc ? (
          <div className="mt-6 rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
            <h2 className="text-xl font-extrabold">Përmbajtja</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{ebook.longDesc}</p>
          </div>
        ) : null}

        <div className="mt-6 rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <h2 className="text-xl font-extrabold">Preview (i kufizuar)</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">2–3 foto/video vetëm për prezantim.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(ebook.previewMedia || []).slice(0, 3).map((m) => (
              <div key={m} className="relative h-56 overflow-hidden rounded-3xl border border-black/10 bg-gray-100 dark:border-white/10 dark:bg-gray-800">
                <Image src={m} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-black/5 bg-gray-50 p-4 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
            Materiali i plotë është i aksesueshëm vetëm pas pagesës.
          </div>
        </div>
      </div>
    </div>
    </FeatureGateOverlay>
  );
}
