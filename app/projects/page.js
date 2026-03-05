import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getUserQaAccess } from '@/lib/qaAccess';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Projektet - Kategoritë e Punëve',
  description:
    'Shiko kategoritë e punëve të realizuara nga Dervishi Renovation: mirëmbajtje, rikonstruksione, rinovime, banjo, kuzhina, hidraulike, elektrike, mure gipsi, bojë, pllaka dhe peizazhim.',
  keywords: [
    'projekte renovimi',
    'punime ndertimi tirane',
    'banjo moderne',
    'kuzhina moderne',
    'hidraulike tirane',
    'elektrike tirane',
    'mure gipsi',
    'bojatisje',
    'pllaka',
    'peizazhim',
  ],
  alternates: { canonical: '/projects' },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    url: '/projects',
    title: 'Projektet - Dervishi Renovation',
    description:
      'Kategoritë e punëve dhe projektet e realizuara: rinovime, banjo, kuzhina, elektrike, hidraulike, gips, bojë, pllaka dhe peizazhim.',
    images: [{ url: '/og-image-v2.png', width: 1200, height: 630, alt: 'Projektet - Dervishi Renovation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projektet - Dervishi Renovation',
    description:
      'Kategoritë e punëve dhe projektet e realizuara: rinovime, banjo, kuzhina, elektrike, hidraulike, gips, bojë, pllaka dhe peizazhim.',
    images: ['/og-image-v2.png'],
  },
};

const CATEGORIES = [
  'Mirembajtje',
  'Rikonstruksione',
  'Rinovime',
  'Banjo',
  'Kuzhina',
  'Hidraulike',
  'Elektrike',
  'Mure gipsi',
  'Boje',
  'Pllaka',
  'Kopshtari dhe peizazhim',
];

function slugifyCategory(name) {
  return name
    .toLowerCase()
    .replace(/ë/g, 'e')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const access = userId ? await getUserQaAccess(userId) : { active: false };

  const projects = await prisma.project.findMany({
    select: { category: true, coverImage: true, images: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const byCategory = new Map();
  for (const p of projects) {
    const cat = p.category || 'Rinovime';
    const entry = byCategory.get(cat) || { count: 0, cover: null };
    entry.count += 1;
    if (!entry.cover) entry.cover = p.coverImage || p.images?.[0] || null;
    byCategory.set(cat, entry);
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Projektet</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Kategoritë e punëve të realizuara. Zgjidh një kategori për të parë fotot dhe videot.
          </p>
        </div>

        <Link
          href="/contact"
          className="rounded-full bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-700"
        >
          Kërko Ofertë
        </Link>
      </div>

      {!access.active ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 text-sm text-gray-700 shadow-sm dark:border-white/10 dark:bg-gray-900 dark:text-gray-200">
          Për të <b>kërkuar ofertë</b>, kërkohet <b>membership aktiv</b> (30 ditë). Shih benefitet dhe aktivizo anëtarësimin te{' '}
          <Link href="/qa" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
            Shërbimi Online
          </Link>.
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const data = byCategory.get(cat) || { count: 0, cover: null };
          const slug = slugifyCategory(cat);
          return (
            <Link
              key={cat}
              href={`/projects/category/${slug}`}
              className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-gray-900"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={
                    data.cover ||
                    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80'
                  }
                  alt={cat}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-lg font-extrabold text-white">{cat}</div>
                  <div className="mt-1 text-xs font-semibold text-white/80">
                    {data.count ? `${data.count} projekt(e)` : 'Së shpejti'}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Kliko për të parë galerinë dhe përshkrimin e punimeve.
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
