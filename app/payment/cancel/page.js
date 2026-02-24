import Link from 'next/link';

export const metadata = { title: 'Pagesa u anulua' };

export default function PaymentCancel() {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <h1 className="text-2xl font-extrabold">Pagesa u anulua</h1>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        Nëse ishte gabim, mund të provoni përsëri nga linku i pagesës.
      </p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-amber-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-amber-700">
        Kthehu te Home
      </Link>
    </div>
  );
}
