import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: "Projektet e Renovimit në Tiranë & Shqipëri",
  description:
    "Shiko projektet e realizuara nga Dervishi Renovation: apartamente, shtëpi, zyra dhe ambiente komerciale. Inspirim, cilësi punimesh dhe detaje para/pas.",
  keywords: [
    "projekte renovimi",
    "renovim apartamenti",
    "renovim tirane",
    "interier modern",
    "para pas renovim",
    "punime ndertimi tirane",
    "dervishi renovation projekte",
  ],
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    locale: "sq_AL",
    url: "/projects",
    title: "Projektet - Dervishi Renovation",
    description:
      "Projektet e realizuara në apartamente, shtëpi, zyra dhe ambiente komerciale. Punime cilësore dhe interiere moderne.",
    images: [{ url: "/og-image-v2.png", width: 1200, height: 630, alt: "Projektet e Dervishi Renovation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projektet - Dervishi Renovation",
    description:
      "Shiko projektet e realizuara: renovim, interier, apartamente, zyra dhe ambiente komerciale.",
    images: ["/og-image-v2.png"],
  },
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className='mt-10'>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Projektet</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Disa nga punët tona të realizuara.
          </p>
        </div>
        <Link href="/qa" className="rounded-full bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-700">
          Kërko Ofertë
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-gray-900"
          >
            <div className="relative h-56 w-full">
              <Image
                src={p.coverImage || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80'}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-5">
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">{p.title}</div>
              <div className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">{p.location || 'Shqipëri'}</div>
              {p.description ? (
                <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
