import Link from 'next/link';

export const metadata = {
  title: 'Lër një Review',
  description:
    'Lër një review për eksperiencën tënde me Dervishi Renovation. Na ndihmon të përmirësohemi dhe u jep siguri klientëve të rinj.',
  alternates: { canonical: '/review' },
};

export default function ReviewPage() {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h1 className="text-3xl font-extrabold">Lër një Review</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Komenti juaj është shumë i rëndësishëm për ne. Plotësoni të dhënat më poshtë dhe shkruani review-n tuaj.
        </p>

        <div className="mt-6 rounded-2xl border border-black/5 bg-gray-50 p-5 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
          Review-t mund të verifikohen dhe të publikohen pasi të shqyrtohen.
        </div>

        <div className="mt-6">
          <Link href="/" className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">
            ← Kthehu në Home
          </Link>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <h2 className="text-xl font-extrabold">Forma e Review</h2>
          <form action="/api/reviews/create" method="POST" className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Emër</label>
                <input
                  name="firstName"
                  required
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Mbiemër</label>
                <input
                  name="lastName"
                  required
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Vlerësimi</label>
              <select
                name="rating"
                defaultValue="5"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
              >
                <option value="5">★★★★★ (5)</option>
                <option value="4">★★★★☆ (4)</option>
                <option value="3">★★★☆☆ (3)</option>
                <option value="2">★★☆☆☆ (2)</option>
                <option value="1">★☆☆☆☆ (1)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">Review</label>
              <textarea
                name="content"
                required
                rows={6}
                className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700"
            >
              Dërgo Review
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Duke dërguar review, pranoni Privacy Policy dhe Terms &amp; Conditions.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
