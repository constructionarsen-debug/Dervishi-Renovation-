'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EbookMediaUpload } from '@/components/UploadButtons';

export default function AdminProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async () => {
    setLoading(true);
    setMsg('');
    const r = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', title, location, description, coverUrl, images }),
    });
    const d = await r.json().catch(() => ({}));
    setLoading(false);
    if (r.ok) {
      setMsg('U krijua ✅');
      setTitle('');
      setLocation('');
      setDescription('');
      setCoverUrl('');
      setImages([]);
      router.refresh();
    } else {
      setMsg(d?.message || d?.error || 'Gabim');
    }
  };

  return (
    <div className="mt-5 space-y-4">
      <div>
        <label className="label">Titulli</label>
        <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="label">Lokacion</label>
        <input className="input mt-1" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div>
        <label className="label">Përshkrimi</label>
        <textarea className="input mt-1 min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="rounded-2xl border border-gray-200/70 dark:border-zinc-800/70 p-4 space-y-3">
        <div className="text-sm font-bold">Cover</div>
        <EbookMediaUpload label="Upload cover" onUploaded={(urls) => setCoverUrl(urls[0] || '')} />
        {coverUrl && <div className="text-xs break-all">{coverUrl}</div>}
      </div>

      <div className="rounded-2xl border border-gray-200/70 dark:border-zinc-800/70 p-4 space-y-3">
        <div className="text-sm font-bold">Gallery images</div>
        <EbookMediaUpload label="Upload images" onUploaded={(urls) => setImages((prev) => [...prev, ...urls])} />
        {images.length ? <div className="text-xs">{images.length} file(s)</div> : <div className="text-xs text-gray-600 dark:text-zinc-300">Asgjë ende.</div>}
      </div>

      <button disabled={loading} onClick={save} className="btn-primary w-full">{loading ? 'Duke ruajtur…' : 'Shto Projekt'}</button>
      {msg && <div className="text-sm text-gray-700 dark:text-zinc-200">{msg}</div>}
    </div>
  );
}
