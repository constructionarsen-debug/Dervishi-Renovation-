'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export default function Lightbox({ open, onClose, src, alt }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] w-full">
          <Image src={src} alt={alt || 'Image'} fill className="object-contain" sizes="100vw" />
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-2 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
          onClick={onClose}
        >
          Mbyll
        </button>
      </div>
    </div>
  );
}
