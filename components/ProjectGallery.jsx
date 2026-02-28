"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Lightbox from "@/components/Lightbox";

export default function ProjectGallery({ images = [], title = "Project" }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const cleanImages = useMemo(() => images.filter(Boolean), [images]);

  // Simple masonry pattern (repeat)
  // You can tweak these spans but this already looks premium.
  const pattern = useMemo(
    () => [
      "sm:col-span-2 sm:row-span-2", // big
      "sm:col-span-1 sm:row-span-1",
      "sm:col-span-1 sm:row-span-1",
      "sm:col-span-1 sm:row-span-2", // tall
      "sm:col-span-1 sm:row-span-1",
      "sm:col-span-1 sm:row-span-1",
      "sm:col-span-2 sm:row-span-1", // wide
      "sm:col-span-1 sm:row-span-1",
    ],
    [],
  );

  return (
    <div>
      {/* Masonry grid */}
      <div className="grid auto-rows-[170px] gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cleanImages.map((img, i) => {
          const span = pattern[i % pattern.length];

          return (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className={`group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-gray-900 ${span}`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={img}
                  alt={`${title} - ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
            </button>
          );
        })}
      </div>

      {/* Lightbox with navigation */}
      <Lightbox
        open={open}
        images={cleanImages}
        index={index}
        title={title}
        onClose={() => setOpen(false)}
        onPrev={() => setIndex((x) => (x - 1 + cleanImages.length) % cleanImages.length)}
        onNext={() => setIndex((x) => (x + 1) % cleanImages.length)}
        onSetIndex={(i) => setIndex(i)}
      />
    </div>
  );
}