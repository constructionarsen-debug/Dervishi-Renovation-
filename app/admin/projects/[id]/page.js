import { prisma } from '@/lib/prisma';
import ProjectUploadTools from '@/components/ProjectUploadTools';

export const metadata = { title: 'Edit Project | Dervishi Renovation' };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditProjectPage({ params }) {
  const id = params?.id;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="text-xl font-extrabold">Projekt nuk u gjet</div>
        <a href="/admin" className="mt-4 inline-flex rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
          Kthehu te Admin
        </a>
      </div>
    );
  }

  const imagesJson = JSON.stringify(project.images || []);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Ndrysho Projekt</h1>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Përditëso tekstin dhe imazhet.</div>
        </div>
        <a href="/admin" className="rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900">
          Mbrapa
        </a>
      </div>

      <form action="/api/admin/projects" method="POST" className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <input type="hidden" name="action" value="update" />
        <input type="hidden" name="id" value={project.id} />

        <div className="grid gap-3">
          <input name="title" defaultValue={project.title} placeholder="Titulli" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />

          <select name="category" defaultValue={project.category || 'Rinovime'} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input name="location" defaultValue={project.location || ''} placeholder="Lokacion" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
          <textarea name="description" defaultValue={project.description || ''} placeholder="Përshkrim" rows={4} className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />

          {/* uploads only */}
          <input id="project_coverImage_edit" name="coverImage" type="hidden" defaultValue={project.coverImage || ''} />
          <input id="project_images_edit" name="images" type="hidden" defaultValue={imagesJson} />

          <ProjectUploadTools coverInputId="project_coverImage_edit" imagesTextareaId="project_images_edit" />

          <button className="rounded-2xl bg-amber-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-amber-700" type="submit">Ruaj ndryshimet</button>
        </div>
      </form>
    </div>
  );
}
