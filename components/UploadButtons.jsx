'use client';

import { UploadButton } from '@uploadthing/react';

export function EbookMediaUpload({ onUploaded, label = 'Upload media' }) {
  return (
    <UploadButton
      endpoint="ebookMedia"
      onClientUploadComplete={(res) => {
        const urls = (res || []).map((r) => r.url);
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
