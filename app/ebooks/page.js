import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import FeatureGateOverlay from '@/components/FeatureGateOverlay';
import { PAYMENTS_ENABLED } from '@/lib/featureFlags';

export const metadata = {
  title: "eBooks për Renovim & Interier",
  description:
    "Udhëzues praktikë (eBooks) për renovim dhe interier: planifikim, buxhetim, materiale, hapa pune dhe këshilla për rezultate profesionale.",
  keywords: [
    "ebook renovim",
    "udhëzues renovimi",
    "ebook interier",
    "planifikim renovimi",
    "materiale renovimi",
    "keshilla interieri",
  ],
  alternates: {
    canonical: "/ebooks",
  },
  openGraph: {
    type: "website",
    locale: "sq_AL",
    url: "/ebooks",
    title: "eBooks - Dervishi Renovation",
    description:
      "eBooks praktike për renovim & interier: planifikim, buxhet, materiale dhe hapa pune.",
    images: [{ url: "/og-image-v2.webp", width: 1200, height: 630, alt: "eBooks për Renovim" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "eBooks - Dervishi Renovation",
    description:
      "eBooks praktike për renovim & interier: planifikim, buxhet, materiale dhe hapa pune.",
    images: ["/og-image-v2.webp"],
  },
};

export default async function EbooksPage() {
  const ebooks = await prisma.ebook.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });

  return (
    <FeatureGateOverlay
      enabled={PAYMENTS_ENABLED}
      title="Payments"
      message="Stripe payments for Ebooks will be enabled soon. For now, this section is temporarily disabled."
    >
    <div className='mt-10'>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Ebook</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Materiale praktike (PDF, foto, video). Preview i kufizuar; materiali i plotë pas pagesës.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {ebooks.map((e) => (
          <Link
            key={e.id}
            href={`/ebooks/${e.slug}`}
            className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-gray-900"
          >
            <div className="relative h-56 w-full">
              <Image
                src={e.coverImage || 'https://images.unsplash.com/photo-1455885666463-1e1967e36a5f?auto=format&fit=crop&w=1600&q=80'}
                alt={e.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-5">
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">{e.title}</div>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{e.shortDesc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-extrabold text-amber-700 dark:text-amber-400">{e.priceLek.toLocaleString('sq-AL')} Lek</div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-200">
                  Shiko
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </FeatureGateOverlay>
  );
}
