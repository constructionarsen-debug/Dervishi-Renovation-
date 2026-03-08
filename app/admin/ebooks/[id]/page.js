import { prisma } from '@/lib/prisma';
import EbookUploadTools from '@/components/EbookUploadTools';
import { HiddenMediaArrayManager, HiddenSingleMediaManager } from '@/components/HiddenMediaManagers';

export const metadata = { title: 'Edit Ebook' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function toLines(items) {
  return Array.isArray(items) ? items.filter(Boolean).join('\n') : '';
}

export default async function EditEbookPage({ params }) {
  const id = params?.id;
  const ebook = await prisma.ebook.findUnique({ where: { id } });

  if (!ebook) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="text-xl font-extrabold">Ebook nuk u gjet</div>
        <a href="/admin" className="mt-4 inline-flex rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
          Kthehu te Admin
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Ndrysho Ebook</h1>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Këtu mund të shtosh ose fshish media individuale.</div>
        </div>
        <a href="/admin" className="rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900">
          Mbrapa
        </a>
      </div>

      <form action="/api/admin/ebooks" method="POST" className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <input type="hidden" name="action" value="update" />
        <input type="hidden" name="id" value={ebook.id} />
        <input id="ebook_coverImage_edit" name="coverImage" type="hidden" defaultValue={ebook.coverImage || ''} />
        <textarea id="ebook_previewMedia_edit" name="previewMedia" defaultValue={toLines(ebook.previewMedia)} className="hidden" readOnly />
        <textarea id="ebook_contentMedia_edit" name="contentMedia" defaultValue={toLines(ebook.contentMedia)} className="hidden" readOnly />
        <input id="ebook_contentUrl_edit" name="contentUrl" type="hidden" defaultValue={ebook.contentUrl || ''} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-3">
            <input name="slug" defaultValue={ebook.slug} placeholder="slug" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
            <input name="title" defaultValue={ebook.title} placeholder="Titulli" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
            <input name="shortDesc" defaultValue={ebook.shortDesc} placeholder="Përshkrim i shkurtër" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
            <textarea name="longDesc" defaultValue={ebook.longDesc || ''} placeholder="Përshkrim i gjatë (opsionale)" rows={3} className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
            <input name="priceLek" type="number" defaultValue={ebook.priceLek} placeholder="Çmimi (Lek)" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />

            <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950">
              <input id="ebook_isActive_edit" name="isActive" type="checkbox" defaultChecked={ebook.isActive} className="h-4 w-4" />
              <label htmlFor="ebook_isActive_edit" className="font-semibold">Aktiv</label>
            </div>

            <EbookUploadTools
              coverInputId="ebook_coverImage_edit"
              previewInputId="ebook_previewMedia_edit"
              contentInputId="ebook_contentMedia_edit"
              contentUrlInputId="ebook_contentUrl_edit"
            />

            <button className="rounded-2xl bg-amber-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-amber-700" type="submit">Ruaj ndryshimet</button>
          </div>

          <div className="space-y-4">
            <HiddenSingleMediaManager inputId="ebook_coverImage_edit" title="Cover aktual" emptyText="Nuk ka cover ende." />
            <HiddenMediaArrayManager inputId="ebook_previewMedia_edit" title="Preview media aktuale" emptyText="Nuk ka preview media ende." />
            <HiddenMediaArrayManager inputId="ebook_contentMedia_edit" title="Content media aktuale" emptyText="Nuk ka content media ende." />
          </div>
        </div>
      </form>
    </div>
  );
}
