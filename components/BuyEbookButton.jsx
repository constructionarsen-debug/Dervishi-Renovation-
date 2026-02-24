'use client';

import { useState } from 'react';

export default function BuyEbookButton({ ebookId }) {
  const [loading, setLoading] = useState(false);

  const buy = async () => {
    setLoading(true);
    const r = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'EBOOK', ebookId }),
    });

    // If not logged in, API returns 401 with redirectUrl
    if (r.status === 401) {
      const data = await r.json().catch(() => ({}));
      window.location.href = data.redirectUrl || '/login';
      return;
    }

    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (data?.payUrl) window.location.href = data.payUrl;
  };

  return (
    <button onClick={buy} disabled={loading} className="btn-primary">
      {loading ? 'Duke hapur Stripe…' : 'Bli Tani'}
    </button>
  );
}
