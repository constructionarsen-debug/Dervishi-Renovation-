import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const metadata = { title: 'Përmbajtja | Dervishi Renovation' };

export default async function EbookContentPage({ params }) {
  const session = await auth();
  if (!session?.user?.email) redirect(`/login?from=${encodeURIComponent(`/ebooks/${params.slug}/content`)}`);

  const ebook = await prisma.ebook.findUnique({ where: { slug: params.slug } });
  if (!ebook || !ebook.isActive) return notFound();

  const user = await prisma.user.findUnique({ where: { email: session.user.email.toLowerCase() } });
  if (!user) redirect(`/login?from=${encodeURIComponent(`/ebooks/${params.slug}/content`)}`);

  const access = await prisma.ebookAccess.findUnique({
    where: { userId_ebookId: { userId: user.id, ebookId: ebook.id } }
  });

  if (!access) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h1 className="text-2xl font-extrabold">Nuk ke akses</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Ky material është i disponueshëm vetëm pas pagesës.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href={`/ebooks/${ebook.slug}`}
            className="rounded-full border border-black/10 bg-white/70 px-5 py-2 text-sm font-extrabold text-gray-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900"
          >
            Kthehu
          </Link>
          <Link
            href={`/ebooks/${ebook.slug}`}
            className="rounded-full bg-amber-600 px-5 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-amber-700"
          >
            Bli akses
          </Link>
        </div>
      </div>
    );
  }

  const urls = (ebook.contentMedia && ebook.contentMedia.length > 0)
    ? ebook.contentMedia
    : (ebook.contentUrl ? [ebook.contentUrl] : []);

  if (!urls || urls.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h1 className="text-2xl font-extrabold">Materiali nuk është ngarkuar</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Admini nuk ka vendosur ende përmbajtjen.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h1 className="text-2xl font-extrabold">{ebook.title}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Përmbajtja e plotë (aktive në bibliotekën tënde).
        </p>

        <div className="mt-6 grid gap-3">
          {urls.map((u, idx) => (
            <a
              key={u}
              href={u}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900"
            >
              Hape materialin #{idx + 1}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
