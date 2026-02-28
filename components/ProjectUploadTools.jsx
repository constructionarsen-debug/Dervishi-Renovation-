'use client';

import { UploadButton } from '@/lib/uploadthing';
import { useState } from 'react';

function getUrl(f) {
  // UploadThing v7+ returns ufsUrl; url may be deprecated depending on version.
  return f?.ufsUrl || f?.url || f?.fileUrl || '';
}

function mergeUrlsIntoField(id, urls) {
  const el = document.getElementById(id);
  if (!el) return;

  // Support both:
  //  - hidden input that stores JSON array (recommended)
  //  - textarea that stores newline-separated URLs (legacy)
  const tag = (el.tagName || '').toLowerCase();
  const type = (el.getAttribute?.('type') || '').toLowerCase();
  const isHiddenJson = tag === 'input' && type === 'hidden';

  if (isHiddenJson) {
    let current = [];
    try {
      current = JSON.parse(el.value || '[]');
      if (!Array.isArray(current)) current = [];
    } catch {
      current = [];
    }

    const merged = Array.from(new Set([...current, ...urls].filter(Boolean)));
    el.value = JSON.stringify(merged);
    return;
  }

  const currentText = (el.value || '').trim();
  const add = urls.join('\n');
  el.value = currentText ? `${currentText}\n${add}` : add;
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = value;
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

export default function ProjectUploadTools({ coverInputId = 'project_coverImage', imagesTextareaId = 'project_images' }) {
  const [msg, setMsg] = useState('');

  return (
    <div className="mt-2 space-y-3">
      <div className="text-xs font-extrabold text-gray-700 dark:text-gray-200">Upload images (UploadThing)</div>

      <div className="grid gap-3">
        <Box title="Cover Image" hint="Ngarko 1 foto dhe do vendoset automatikisht te Cover image URL">
          <UploadButton
            endpoint="projectMedia"
            appearance={{
              button:
                'ut-ready:bg-amber-600 ut-ready:hover:bg-amber-700 ut-uploading:bg-amber-700 ut-ready:text-white ut-button:rounded-2xl ut-button:px-4 ut-button:py-3 ut-button:text-xs ut-button:font-extrabold',
              container: 'w-full'
            }}
            onClientUploadComplete={(res) => {
              const urls = (res || []).map(getUrl).filter(Boolean);
              if (urls[0]) setValue(coverInputId, urls[0]);
              setMsg('Cover u ngarkua.');
            }}
            onUploadError={(error) => setMsg(`ERROR: ${error.message}`)}
          />
        </Box>

        <Box title="Gallery images" hint="Ngarko disa foto dhe do shtohen te lista e imazheve (1 URL për rresht).">
          <UploadButton
            endpoint="projectMedia"
            appearance={{
              button:
                'ut-ready:bg-gray-900 ut-ready:hover:bg-black ut-uploading:bg-black ut-ready:text-white ut-button:rounded-2xl ut-button:px-4 ut-button:py-3 ut-button:text-xs ut-button:font-extrabold dark:ut-ready:bg-white dark:ut-ready:text-gray-900',
              container: 'w-full'
            }}
            onClientUploadComplete={(res) => {
              const urls = (res || []).map(getUrl).filter(Boolean);
              mergeUrlsIntoField(imagesTextareaId, urls);
              setMsg('Gallery u shtua.');
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
