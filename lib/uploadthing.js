import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react';

// In JS projects we can't easily attach endpoint types here.
// You still get the endpoint string safety by keeping endpoints centralized.
export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();
