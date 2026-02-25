'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  const sp = useSearchParams();
  const callbackUrl = sp.get('from') || '/library';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md mt-10">
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h1 className="text-2xl font-extrabold">Login</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Hyni për të aksesuar bibliotekën dhe shërbimet.</p>

        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl })}
          className="mt-6 w-full rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-white dark:hover:bg-white/5"
        >
          Vazhdoni me Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400">ose</div>
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            const res = await signIn('credentials', {
              email,
              password,
              redirect: false,
              callbackUrl
            });
            setLoading(false);
            if (res?.error) setError('Email ose password gabim.');
            if (res?.ok) window.location.href = callbackUrl;
          }}
        >
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
          >
            {loading ? 'Duke hyrë…' : 'Hyr'}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600 dark:text-gray-300">
          Nuk ke llogari?{' '}
          <Link className="font-extrabold text-amber-700 hover:underline dark:text-amber-400" href={`/register?from=${encodeURIComponent(callbackUrl)}`}>
            Regjistrohu
          </Link>
        </p>
      </div>
    </div>
  );
}
