import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function DownloadPage({ params }) {
  const order = await prisma.order.findUnique({ where: { accessToken: params.token }, include: { ebook: true } });
  if (!order) return notFound();

  if (order.type !== 'EBOOK') {
    return notFound();
  }

  if (order.paymentStatus !== 'PAID') {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h1 className="text-2xl font-extrabold">Aksesi nuk është aktiv</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Ky material aktivizohet vetëm pas pagesës. Kthehu te linku i pagesës.
        </p>
      </div>
    );
  }

  const urls = (order.ebook?.contentMedia && order.ebook.contentMedia.length > 0)
    ? order.ebook.contentMedia
    : (order.ebook?.contentUrl ? [order.ebook.contentUrl] : []);

  if (urls.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h1 className="text-2xl font-extrabold">Materiali nuk është ngarkuar</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Admini nuk ka vendosur ende linkun e përmbajtjes për këtë ebook.
        </p>
      </div>
    );
  }

  // If only 1 file, keep the old behavior.
  if (urls.length === 1) {
    redirect(urls[0]);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h1 className="text-2xl font-extrabold">Materiali juaj</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Zgjidh çfarë dëshiron të hapësh/shkarkosh.
        </p>

        <div className="mt-6 grid gap-3">
          {urls.map((u, idx) => (
            <a
              key={u}
              href={u}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-black/10 bg-gray-50 px-5 py-4 text-sm font-extrabold text-gray-900 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <span>Hap materialin {idx + 1}</span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-300">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
