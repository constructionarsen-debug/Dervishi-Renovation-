'use client';

import { UploadButton } from '@uploadthing/react';

export function EbookMediaUpload({ onUploaded, label = 'Upload media' }) {
  return (
    <UploadButton
      endpoint="ebookMedia"
      onClientUploadComplete={(res) => {
        // UploadThing's client response fields can vary by version.
        // Prefer ufsUrl (recommended in docs), then url/fileUrl.
        const urls = (res || [])
          .map((r) => r?.ufsUrl || r?.url || r?.fileUrl)
          .filter(Boolean);
        onUploaded?.(urls);
      }}
      onUploadError={(error) => {
        alert(error.message);
      }}
      appearance={{
        button: 'btn-ghost',
        allowedContent: 'text-xs text-gray-500 dark:text-zinc-300',
        container: 'w-full',
      }}
      content={{
        button: label,
      }}
    />
  );
}
