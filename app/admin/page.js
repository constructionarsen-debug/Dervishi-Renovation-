import { prisma } from '@/lib/prisma';
import AdminSignOut from '@/components/AdminSignOut';
import EbookUploadTools from '@/components/EbookUploadTools';
import ProjectUploadTools from '@/components/ProjectUploadTools';

export const metadata = { title: 'Admin' };

function Section({ title, children }) {
  return (
    <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <h2 className="text-xl font-extrabold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function AdminPage() {
  const [orders, questions, prices, contacts, projects, ebooks] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 30, include: { ebook: true, question: true } }),
    prisma.question.findMany({ orderBy: { createdAt: 'desc' }, take: 30, include: { order: true } }),
    prisma.priceSetting.findMany({ where: { key: 'qa_monthly' }, orderBy: { updatedAt: 'desc' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
    prisma.ebook.findMany({ orderBy: { createdAt: 'desc' }, take: 12 })
  ]);

  const salesLek = orders.filter((o) => o.paymentStatus === 'PAID').reduce((s, o) => s + o.amountLek, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Menaxhim i pyetjeve, ebook-eve, projekteve dhe pagesave.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-gray-900 shadow-sm dark:border-white/10 dark:bg-gray-900 dark:text-white">
            Shitje: {salesLek.toLocaleString('sq-AL')} Lek
          </div>
          <AdminSignOut />
        </div>
      </div>

      <Section title="Çmimet">
        <div className="grid gap-5 lg:grid-cols-2">
          {prices.map((p) => (
            <form key={p.id} action="/api/admin/prices" method="POST" className="rounded-2xl border border-black/5 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/5">
              <input type="hidden" name="key" value={p.key} />
              <div className="text-sm font-extrabold">Konfiguro çmimin mujor</div>
              <div className="mt-4 grid gap-3">
                <input name="title" defaultValue={p.title} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
                <input name="description" defaultValue={p.description || ''} placeholder="Përshkrim" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
                <input name="priceLek" type="number" defaultValue={p.priceLek} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
                <button className="rounded-2xl bg-amber-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-amber-700" type="submit">Ruaj</button>
              </div>
            </form>
          ))}
        </div>
      </Section>

      <Section title="Pagesat & Porositë">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-extrabold text-gray-600 dark:text-gray-300">
              <tr>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Tipi</th>
                <th className="py-2 pr-4">Klienti</th>
                <th className="py-2 pr-4">Shuma</th>
                <th className="py-2 pr-4">Statusi</th>
                <th className="py-2 pr-4">Veprim</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-black/5 dark:border-white/10">
                  <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleString('sq-AL')}</td>
                  <td className="py-3 pr-4 font-semibold">{o.type}</td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold">{o.customerName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{o.customerEmail}</div>
                  </td>
                  <td className="py-3 pr-4 font-extrabold">{o.amountLek.toLocaleString('sq-AL')} Lek</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-extrabold text-gray-800 dark:bg-white/10 dark:text-gray-200">
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <form action="/api/admin/orders" method="POST" className="flex flex-wrap gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="paymentStatus" defaultValue={o.paymentStatus} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold dark:border-white/10 dark:bg-gray-950">
                        {['UNPAID', 'PENDING', 'PAID', 'FAILED', 'CANCELED'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-amber-700" type="submit">Update</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Pyetje & Konsulta">
        <div className="space-y-5">
          {questions.map((q) => (
            <div key={q.id} className="rounded-2xl border border-black/5 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold">{q.name} <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">({q.email})</span></div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{new Date(q.createdAt).toLocaleString('sq-AL')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-gray-800 dark:bg-gray-950 dark:text-gray-200">
                    {q.order?.paymentStatus || 'NO_ORDER'}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">{q.message}</p>

              <form action="/api/admin/questions" method="POST" className="mt-4 space-y-3">
                <input type="hidden" name="id" value={q.id} />
                <textarea
                  name="answer"
                  defaultValue={q.answer || ''}
                  placeholder="Shkruaj përgjigjen…"
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
                />
                <button className="rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" type="submit">
                  Ruaj përgjigjen
                </button>
              </form>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Mesazhe Kontakti">
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-2xl border border-black/5 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold">{c.name} <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">({c.email})</span></div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{new Date(c.createdAt).toLocaleString('sq-AL')}{c.phone ? ` • ${c.phone}` : ''}</div>
                </div>
                <form action="/api/admin/contact" method="POST" className="flex items-center gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="handled" value={String(!c.handled)} />
                  <button className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900" type="submit">
                    {c.handled ? 'Shëno si pa-trajtuar' : 'Shëno si trajtuar'}
                  </button>
                </form>
              </div>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">{c.message}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Projektet (gallery)">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {projects.map((p) => (
              <form key={p.id} action="/api/admin/projects" method="POST" className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div>
                  <div className="text-sm font-extrabold">{p.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{p.location || 'Shqipëri'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/admin/projects/${p.id}`} className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900">Ndrysho</a>
                  <input type="hidden" name="action" value="delete" />
                  <input type="hidden" name="id" value={p.id} />
                  <button className="rounded-full bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700" type="submit">Fshi</button>
                </div>
              </form>
            ))}
          </div> 

          <form action="/api/admin/projects" method="POST" className="rounded-2xl border border-dashed border-black/20 bg-white p-5 dark:border-white/20 dark:bg-gray-950/30">
            <div className="text-sm font-extrabold">Shto projekt</div>
            <div className="mt-4 grid gap-3">
              <input name="title" placeholder="Titulli" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
              <input name="location" placeholder="Lokacion" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
              <textarea name="description" placeholder="Përshkrim" rows={3} className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />

              <ProjectUploadTools coverInputId="project_coverImage" imagesTextareaId="project_images" />
              <button className="rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" type="submit">Krijo</button>
            </div>
          </form>
        </div>
      </Section>

      <Section title="Ebook-et">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {ebooks.map((e) => (
              <form key={e.id} action="/api/admin/ebooks" method="POST" className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div>
                  <div className="text-sm font-extrabold">{e.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">/{e.slug} • {e.priceLek.toLocaleString('sq-AL')} Lek • {e.isActive ? 'Aktiv' : 'Jo aktiv'}</div>
                </div>
                <input type="hidden" name="action" value="toggle" />
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="isActive" value={String(!e.isActive)} />
                <button className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900" type="submit">
                  {e.isActive ? 'Çaktivizo' : 'Aktivizo'}
                </button>
              </form>
            ))}
          </div>

          <form action="/api/admin/ebooks" method="POST" className="rounded-2xl border border-dashed border-black/20 bg-white p-5 dark:border-white/20 dark:bg-gray-950/30">
            <div className="text-sm font-extrabold">Krijo / Përditëso ebook (me slug)</div>
            <div className="mt-4 grid gap-3">
              <input name="slug" placeholder="slug (p.sh. udhezues-rinovimi)" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
              <input name="title" placeholder="Titulli" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
              <input name="shortDesc" placeholder="Përshkrim i shkurtër" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
              <textarea name="longDesc" placeholder="Përshkrim i gjatë (opsionale)" rows={3} className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />
              <input name="priceLek" type="number" placeholder="Çmimi (Lek)" required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" />              
              {/* <input id="ebook_contentUrl" name="contentUrl" placeholder="(Legacy) Content URL - 1 link" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-gray-950" /> */}

              <EbookUploadTools />
              <button className="rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" type="submit">Ruaj</button>
            </div>
          </form>
        </div>
      </Section>
    </div>
  );
}
