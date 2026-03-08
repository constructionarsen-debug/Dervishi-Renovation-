'use client';

import { UploadButton } from '@/lib/uploadthing';
import { useState } from 'react';

function appendLines(id, urls) {
  const el = document.getElementById(id);
  if (!el) return;
  const current = (el.value || '').trim();
  const add = urls.join('\n');
  el.value = current ? `${current}\n${add}` : add;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function Box({ title, children, hint }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm dark:border-white/10 dark:bg-gray-950">
      <div className="text-xs font-extrabold text-gray-700 dark:text-gray-200">{title}</div>
      {hint ? <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</div> : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function EbookUploadTools({
  coverInputId = 'ebook_coverImage',
  previewInputId = 'ebook_previewMedia',
  contentInputId = 'ebook_contentMedia',
  contentUrlInputId = 'ebook_contentUrl',
}) {
  const [msg, setMsg] = useState('');

  return (
    <div className="mt-2 space-y-3">
      <div className="text-xs font-extrabold text-gray-700 dark:text-gray-200">Upload media (UploadThing)</div>

      <div className="grid gap-3">
        <Box title="Cover Image" hint="Ngarko 1 foto dhe do vendoset automatikisht te Cover image URL">
          <UploadButton
            endpoint="ebookMedia"
            appearance={{
              button: 'ut-ready:bg-amber-600 ut-ready:hover:bg-amber-700 ut-uploading:bg-amber-700 ut-ready:text-white ut-button:rounded-2xl ut-button:px-4 ut-button:py-3 ut-button:text-xs ut-button:font-extrabold',
              container: 'w-full'
            }}
            onClientUploadComplete={(res) => {
              const urls = (res || [])
                .map((f) => f?.ufsUrl || f?.url || f?.fileUrl)
                .filter(Boolean);
              if (urls[0]) setValue(coverInputId, urls[0]);
              setMsg('Cover u ngarkua.');
            }}
            onUploadError={(error) => setMsg(`ERROR: ${error.message}`)}
          />
        </Box>

        <Box title="Preview media" hint="Foto/video për prezantim (shfaqet publikisht). Shtohet te Preview media textarea.">
          <UploadButton
            endpoint="ebookMedia"
            appearance={{
              button: 'ut-ready:bg-gray-900 ut-ready:hover:bg-black ut-uploading:bg-black ut-ready:text-white ut-button:rounded-2xl ut-button:px-4 ut-button:py-3 ut-button:text-xs ut-button:font-extrabold dark:ut-ready:bg-white dark:ut-ready:text-gray-900',
              container: 'w-full'
            }}
            onClientUploadComplete={(res) => {
              const urls = (res || [])
                .map((f) => f?.ufsUrl || f?.url || f?.fileUrl)
                .filter(Boolean);
              appendLines(previewInputId, urls);
              setMsg('Preview media u shtua.');
            }}
            onUploadError={(error) => setMsg(`ERROR: ${error.message}`)}
          />
        </Box>

        <Box title="Content media" hint="Materiali i plotë (PDF/video) - vetëm pas pagesës. Shtohet te Content media textarea.">
          <UploadButton
            endpoint="ebookMedia"
            appearance={{
              button: 'ut-ready:bg-emerald-600 ut-ready:hover:bg-emerald-700 ut-uploading:bg-emerald-700 ut-ready:text-white ut-button:rounded-2xl ut-button:px-4 ut-button:py-3 ut-button:text-xs ut-button:font-extrabold',
              container: 'w-full'
            }}
            onClientUploadComplete={(res) => {
              const urls = (res || [])
                .map((f) => f?.ufsUrl || f?.url || f?.fileUrl)
                .filter(Boolean);
              appendLines(contentInputId, urls);
              // keep legacy in sync when only one URL
              if (urls.length === 1) setValue(contentUrlInputId, urls[0]);
              setMsg('Content media u shtua.');
            }}
            onUploadError={(error) => setMsg(`ERROR: ${error.message}`)}
          />
        </Box>
      </div>

      {msg ? (
        <div className="rounded-2xl border border-black/10 bg-gray-50 p-3 text-xs font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
          {msg}
        </div>
      ) : null}

      <div className="text-[11px] text-gray-500 dark:text-gray-400">
        * Upload funksionon vetëm kur je i kyçur si ADMIN.
      </div>
    </div>
  );
}
