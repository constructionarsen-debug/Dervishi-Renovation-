'use client';

import { useEffect, useMemo, useState } from 'react';

function isVideo(url = '') {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
}

function isPdf(url = '') {
  return /\.(pdf)(\?|$)/i.test(url);
}

function readHiddenValue(id, multiple = false) {
  if (typeof document === 'undefined') return multiple ? [] : '';
  const el = document.getElementById(id);
  if (!el) return multiple ? [] : '';
  const value = String(el.value || '').trim();

  if (!multiple) return value;
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function writeHiddenValue(id, value, multiple = false) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;

  el.value = multiple ? JSON.stringify(value || []) : String(value || '');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function MediaPreview({ url }) {
  if (!url) return null;

  if (isVideo(url)) {
    return <video src={url} className="h-24 w-full rounded-xl object-cover" muted playsInline controls />;
  }

  if (isPdf(url)) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-black/10 bg-gray-50 text-xs font-extrabold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
        PDF
      </div>
    );
  }

  return <img src={url} alt="media" className="h-24 w-full rounded-xl object-cover" />;
}

export function HiddenSingleMediaManager({ inputId, title = 'Media aktuale', emptyText = 'Asgjë ende.' }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const sync = () => setValue(readHiddenValue(inputId, false));
    sync();
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('input', sync);
    el.addEventListener('change', sync);
    return () => {
      el.removeEventListener('input', sync);
      el.removeEventListener('change', sync);
    };
  }, [inputId]);

  return (
    <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-gray-950">
      <div className="text-sm font-extrabold">{title}</div>
      {value ? (
        <div className="space-y-3">
          <MediaPreview url={value} />
          <div className="break-all text-xs text-gray-500 dark:text-gray-400">{value}</div>
          <button
            type="button"
            onClick={() => writeHiddenValue(inputId, '', false)}
            className="rounded-full bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700"
          >
            Hiqe
          </button>
        </div>
      ) : (
        <div className="text-xs text-gray-500 dark:text-gray-400">{emptyText}</div>
      )}
    </div>
  );
}

export function HiddenMediaArrayManager({ inputId, title = 'Media aktuale', emptyText = 'Asgjë ende.' }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sync = () => setItems(readHiddenValue(inputId, true));
    sync();
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('input', sync);
    el.addEventListener('change', sync);
    return () => {
      el.removeEventListener('input', sync);
      el.removeEventListener('change', sync);
    };
  }, [inputId]);

  const countText = useMemo(() => `${items.length} file(s)`, [items.length]);

  return (
    <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-gray-950">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold">{title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{countText}</div>
      </div>

      {items.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((url, index) => (
            <div key={`${url}-${index}`} className="rounded-2xl border border-black/10 p-3 dark:border-white/10">
              <MediaPreview url={url} />
              <div className="mt-2 break-all text-xs text-gray-500 dark:text-gray-400">{url}</div>
              <button
                type="button"
                onClick={() => writeHiddenValue(inputId, items.filter((_, i) => i !== index), true)}
                className="mt-3 rounded-full bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700"
              >
                Fshi këtë
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-500 dark:text-gray-400">{emptyText}</div>
      )}
    </div>
  );
}
