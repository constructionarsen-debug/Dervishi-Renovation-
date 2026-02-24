import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProjectGallery from '@/components/ProjectGallery';

export default async function ProjectDetailPage({ params }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return notFound();

  const images = [project.coverImage, ...(project.images || [])].filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/projects" className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">
            ← Kthehu te projektet
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold">{project.title}</h1>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{project.location || 'Shqipëri'}</div>
        </div>
        <Link href="/qa" className="rounded-full bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-700">
          Kërko Ofertë
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft dark:border-white/10 dark:bg-gray-900">
        <div className="relative h-[360px] w-full">
          <Image
            src={project.coverImage || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&q=80'}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {project.description ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <h2 className="text-xl font-extrabold">Përshkrimi</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{project.description}</p>
        </div>
      ) : null}

      <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h2 className="text-xl font-extrabold">Gallery</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Kliko një foto për ta hapur në format të madh.</p>
        <div className="mt-5">
          <ProjectGallery images={images} title={project.title} />
        </div>
      </div>
    </div>
  );
}
