import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: 'Biblioteka | Dervishi Renovation' };

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login?from=/library");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
  });
  if (!user) redirect('/login?from=/library');

  const accesses = await prisma.ebookAccess.findMany({
    where: { userId: user.id },
    include: { ebook: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mt-10">
        <div>
          <h1 className="text-3xl font-extrabold">Biblioteka</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Blerjet e tua (materialet e aktivizuara).</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {accesses.length === 0 ? (
          <div className="md:col-span-3 rounded-[2rem] border border-black/10 bg-white p-7 text-sm text-gray-700 shadow-sm dark:border-white/10 dark:bg-gray-900 dark:text-gray-200">
            Nuk ke ende blerje të aktivizuara. Shiko <Link href="/ebooks" className="font-extrabold text-amber-700 dark:text-amber-400">Ebook-et</Link>.
          </div>
        ) : (
          accesses.map((a) => (
            <div key={a.id} className="rounded-[1.6rem] border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">{a.ebook.title}</div>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{a.ebook.shortDesc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  Aktivizuar: {new Date(a.createdAt).toLocaleDateString('sq-AL')}
                </div>
                <Link
                  href={`/ebooks/${a.ebook.slug}/content`}
                  className="rounded-full bg-amber-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-amber-700"
                >
                  Hape
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
