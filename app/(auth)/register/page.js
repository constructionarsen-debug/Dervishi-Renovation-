'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RegisterPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get('from') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setOk(false);

    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setErr(data?.message || 'Regjistrimi dështoi.');
      return;
    }

    setOk(true);
    // Auto sign-in after register
    const res = await signIn('credentials', { email, password, redirect: false });
    if (!res?.error) router.replace(from);
  };

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900 mt-10">
      <h1 className="text-2xl font-extrabold">Regjistrohu</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Krijo llogari për të ruajtur blerjet dhe për të dërguar pyetje.
      </p>

      {err && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
          {err}
        </div>
      )}
      {ok && (
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-200">
          Regjistrimi u krye me sukses.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold">Emri</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Fjalëkalimi</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-white/10 dark:bg-gray-950"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-gray-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          Regjistrohu
        </button>
      </form>

      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: from })}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-extrabold text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900"
      >
        Regjistrohu me Google
      </button>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
        Ke llogari?{' '}
        <Link href={`/login?from=${encodeURIComponent(from)}`} className="font-extrabold text-amber-700 dark:text-amber-400">
          Hyr
        </Link>
      </div>
    </div>
  );
}
