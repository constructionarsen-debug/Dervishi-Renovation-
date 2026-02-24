'use client';

import { useState } from 'react';

export default function SettingsForm({ initialQaPriceCents, currency }) {
  const [qaPrice, setQaPrice] = useState(String((initialQaPriceCents / 100).toFixed(2)));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async () => {
    setLoading(true);
    setMsg('');
    const cents = Math.round(parseFloat(qaPrice || '0') * 100);
    const r = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qaPriceCents: cents }),
    });
    setLoading(false);
    setMsg(r.ok ? 'U ruajt ✅' : 'Gabim');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Q&A Price ({currency})</label>
        <input className="input mt-1" value={qaPrice} onChange={(e) => setQaPrice(e.target.value)} />
        <div className="mt-2 text-xs text-gray-600 dark:text-zinc-300">Vendos manualisht çmimin që shfaqet te Q&A.</div>
      </div>
      <button disabled={loading} onClick={save} className="btn-primary w-full">{loading ? 'Duke ruajtur…' : 'Ruaj'}</button>
      {msg && <div className="text-sm text-gray-700 dark:text-zinc-200">{msg}</div>}
    </div>
  );
}
