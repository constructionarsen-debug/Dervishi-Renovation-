'use client';

import { useMemo, useState } from 'react';
import { EbookMediaUpload } from '@/components/UploadButtons';

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export default function AdminEbookForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('29.00');
  const [coverUrl, setCoverUrl] = useState('');
  const [previewMedia, setPreviewMedia] = useState([]);
  const [contentMedia, setContentMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const slug = useMemo(() => slugify(title), [title]);

  const save = async () => {
    setLoading(true);
    setMsg('');
    const priceCents = Math.round(parseFloat(price || '0') * 100);
    const r = await fetch('/api/admin/ebooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, description, priceCents, coverUrl, previewMedia, contentMedia }),
    });
    const d = await r.json().catch(() => ({}));
    setLoading(false);
    setMsg(r.ok ? 'U krijua ✅ (refresh page)' : (d?.error || 'Gabim'));
  };

  return (
    <div className="mt-5 space-y-4">
      <div>
        <label className="label">Titulli</label>
        <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="mt-2 text-xs text-gray-600 dark:text-zinc-300">Slug: <span className="font-mono">{slug || '-'}</span></div>
      </div>
      <div>
        <label className="label">Përshkrimi</label>
        <textarea className="input mt-1 min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="label">Çmimi (EUR)</label>
        <input className="input mt-1" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>

      <div className="rounded-2xl border border-gray-200/70 dark:border-zinc-800/70 p-4 space-y-3">
        <div className="text-sm font-bold">Cover</div>
        <EbookMediaUpload label="Upload cover" onUploaded={(urls) => setCoverUrl(urls[0] || '')} />
        {coverUrl && <div className="text-xs break-all">{coverUrl}</div>}
      </div>

      <div className="rounded-2xl border border-gray-200/70 dark:border-zinc-800/70 p-4 space-y-3">
        <div className="text-sm font-bold">Preview media</div>
        <EbookMediaUpload label="Upload preview" onUploaded={(urls) => setPreviewMedia((prev) => [...prev, ...urls])} />
        {previewMedia.length ? <div className="text-xs">{previewMedia.length} file(s)</div> : <div className="text-xs text-gray-600 dark:text-zinc-300">Asgjë ende.</div>}
      </div>

      <div className="rounded-2xl border border-gray-200/70 dark:border-zinc-800/70 p-4 space-y-3">
        <div className="text-sm font-bold">Content media (paid)</div>
        <EbookMediaUpload label="Upload content" onUploaded={(urls) => setContentMedia((prev) => [...prev, ...urls])} />
        {contentMedia.length ? <div className="text-xs">{contentMedia.length} file(s)</div> : <div className="text-xs text-gray-600 dark:text-zinc-300">Asgjë ende.</div>}
      </div>

      <button disabled={loading} onClick={save} className="btn-primary w-full">{loading ? 'Duke ruajtur…' : 'Krijo Ebook'}</button>
      {msg && <div className="text-sm text-gray-700 dark:text-zinc-200">{msg}</div>}
    </div>
  );
}
