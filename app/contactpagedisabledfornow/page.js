// export const metadata = { title: 'Kontakt | Dervishi Renovation' };

// export default function ContactPage() {
//   return (
//     <div className="grid gap-8 lg:grid-cols-12 mt-10">
//       <div className="lg:col-span-5">
//         <h1 className="text-3xl font-extrabold">Kontakt</h1>
//         <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
//           Na shkruani për ofertë, pyetje ose bashkëpunim. Mund të na kontaktoni edhe direkt në WhatsApp.
//         </p>

//         <div id="oferta" className="mt-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
//           <div className="text-sm font-extrabold">Kontakt i shpejtë</div>
//           <div className="mt-4 flex flex-wrap gap-3">
//             <a
//               href="https://wa.me/355000000000"
//               target="_blank"
//               rel="noreferrer"
//               className="rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
//             >
//               WhatsApp
//             </a>
//             <a
//               href="https://instagram.com"
//               target="_blank"
//               rel="noreferrer"
//               className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
//             >
//               Instagram
//             </a>
//           </div>

//           <div className="mt-5 text-sm text-gray-600 dark:text-gray-300">
//             Orari: Hënë–Shtunë, 09:00–18:00
//           </div>
//         </div>
//       </div>

//       <div className="lg:col-span-7">
//         <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
//           <h2 className="text-xl font-extrabold">Dërgo mesazh</h2>
//           <form action="/api/contact" method="POST" className="mt-6 space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="text-sm font-semibold">Emër</label>
//                 <input name="name" required className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950" />
//               </div>
//               <div>
//                 <label className="text-sm font-semibold">Email</label>
//                 <input type="email" name="email" required className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950" />
//               </div>
//             </div>
//             <div>
//               <label className="text-sm font-semibold">Numër telefoni (opsionale)</label>
//               <input name="phone" className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950" />
//             </div>
//             <div>
//               <label className="text-sm font-semibold">Mesazh</label>
//               <textarea name="message" required rows={6} className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950" />
//             </div>
//             <button type="submit" className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700">
//               Dërgo
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
