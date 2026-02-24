import { prisma } from '@/lib/prisma';
import AdminProjectForm from '@/components/AdminProjectForm';

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <main className="container-pad">
      <h1 className="text-3xl font-extrabold">Projektet</h1>
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="card p-8">
          <h2 className="text-xl font-extrabold">Shto Projekt</h2>
          <AdminProjectForm />
        </div>
        <div className="card p-8">
          <h2 className="text-xl font-extrabold">Lista</h2>
          <div className="mt-4 space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-2xl border border-gray-200/70 dark:border-zinc-800/70 p-4">
                <div className="font-extrabold">{p.title}</div>
                <div className="text-xs text-gray-600 dark:text-zinc-300">{p.location || ''}</div>
              </div>
            ))}
            {!projects.length && <div className="text-sm text-gray-600 dark:text-zinc-300">Asnjë projekt ende.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
