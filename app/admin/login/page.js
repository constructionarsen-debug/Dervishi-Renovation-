'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const sp = useSearchParams();
  const callbackUrl = sp.get('from') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <h1 className="text-2xl font-extrabold">Admin Login</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Hyni me kredencialet e adminit.</p>

        <form
          className="mt-6 space-y-4"
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
            className="w-full rounded-2xl bg-gray-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-black disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            {loading ? 'Duke hyrë…' : 'Hyr'}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Krijo adminin me: <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">npm run seed</code>
        </p>
      </div>
    </div>
  );
}
