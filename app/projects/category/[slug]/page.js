import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectGallery from '@/components/ProjectGallery';
import { auth } from '@/lib/auth';
import { getUserQaAccess } from '@/lib/qaAccess';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

function categoryFromSlug(slug) {
  return CATEGORIES.find((c) => slugifyCategory(c) === slug) || null;
}

export async function generateMetadata({ params }) {
  const category = categoryFromSlug(params.slug);
  if (!category) return { title: 'Projektet' };
  return {
    title: `${category} | Projektet - Dervishi Renovation`,
    description: `Foto dhe video nga punimet tona për kategorinë: ${category}.`,
    alternates: { canonical: `/projects/category/${params.slug}` },
    openGraph: {
      type: 'website',
      locale: 'sq_AL',
      url: `/projects/category/${params.slug}`,
      title: `${category} | Dervishi Renovation`,
      description: `Shiko galerinë e punimeve për kategorinë: ${category}.`,
      images: [{ url: '/og-image-v2.png', width: 1200, height: 630, alt: `${category} - Projektet` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category} | Dervishi Renovation`,
      description: `Shiko galerinë e punimeve për kategorinë: ${category}.`,
      images: ['/og-image-v2.png'],
    },
  };
}

export default async function ProjectCategoryPage({ params }) {
  const category = categoryFromSlug(params.slug);
  if (!category) return notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const access = userId ? await getUserQaAccess(userId) : { active: false };

  const projects = await prisma.project.findMany({
    where: { category },
    orderBy: { updatedAt: 'desc' },
  });

  const media = projects
    .flatMap((p) => [p.coverImage, ...(p.images || [])])
    .filter(Boolean);

  const hero = media[0] || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&q=80';

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/projects" className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">
            ← Kthehu te kategoritë
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold">{category}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Përshkrim i punimeve për këtë kategori (mund ta përditësojmë kur të kesh tekstin final).
          </p>
        </div>

        <Link href="/contact" className="rounded-full bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-700">
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

      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft dark:border-white/10 dark:bg-gray-900">
        <div className="relative h-[420px] w-full">
          <Image src={hero} alt={category} fill sizes="100vw" className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div className="text-sm font-semibold text-white/85">{projects.length ? `${projects.length} projekt(e)` : 'Së shpejti'}</div>
          </div>
        </div>
      </div>

      {media.length ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <h2 className="text-xl font-extrabold">Galeria</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Kliko një foto për ta hapur në format të madh. ⬅️➡️</p>
          <div className="mt-5">
            <ProjectGallery images={media} title={category} />
          </div>
        </div>
      ) : null}

      {projects.length ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <h2 className="text-xl font-extrabold">Projektet në këtë kategori</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-gray-950"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={p.coverImage || hero}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-extrabold text-gray-900 dark:text-white">{p.title}</div>
                  <div className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">{p.location || 'Shqipëri'}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
