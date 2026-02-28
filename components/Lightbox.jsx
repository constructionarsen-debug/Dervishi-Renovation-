"use client";

import { useEffect, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({
  open,
  images = [],
  index = 0,
  title = "Image",
  onClose,
  onPrev,
  onNext,
  onSetIndex,
}) {
  const src = useMemo(() => images?.[index] || "", [images, index]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };

    document.addEventListener("keydown", onKeyDown);

    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={() => onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="text-sm text-white/80">
            {images.length ? `${index + 1} / ${images.length}` : ""}
          </div>

          <div className="truncate px-2 text-sm font-semibold text-white/90">
            {title}
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Image area */}
        <div className="relative flex items-center justify-center">
          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => onPrev?.()}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/5 p-3 text-white/90 hover:bg-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => onNext?.()}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/5 p-3 text-white/90 hover:bg-white/10"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Use <img> here for simplicity & to avoid Next/Image domain config issues */}
          <img
            src={src}
            alt={title}
            className="max-h-[78vh] w-full object-contain"
            draggable={false}
          />
        </div>

        {/* Thumbnails (optional, but feels premium + fast navigation) */}
        {images.length > 1 && (
          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((im, i) => (
                <button
                  key={`${im}-${i}`}
                  type="button"
                  onClick={() => onSetIndex?.(i)}
                  className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border ${
                    i === index
                      ? "border-white/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  aria-label={`Open image ${i + 1}`}
                >
                  <img
                    src={im}
                    alt={`${title} thumb ${i + 1}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}