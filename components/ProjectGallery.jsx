'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from '@/components/Lightbox';

export default function ProjectGallery({ images, title }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState('');

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((img) => (
          <button
            key={img}
            type="button"
            onClick={() => {
              setSrc(img);
              setOpen(true);
            }}
            className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-gray-900"
          >
            <div className="relative h-60 w-full">
              <Image
                src={img}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </button>
        ))}
      </div>
      <Lightbox open={open} src={src} alt={title} onClose={() => setOpen(false)} />
    </div>
  );
}
