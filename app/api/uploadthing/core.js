import { createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

async function requireAdmin() {
const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new UploadThingError('Unauthorized');
  }
  return session;
}

/**
 * File routes:
 * - ebookMedia: PDF/images/videos for ebooks (preview + full content)
 * - projectMedia: images for projects (cover + gallery)
 */
export const ourFileRouter = {
  ebookMedia: f({
    image: { maxFileSize: '8MB', maxFileCount: 5 },
    pdf: { maxFileSize: '32MB', maxFileCount: 3 },
    video: { maxFileSize: '128MB', maxFileCount: 3 }
  })
    .middleware(async () => {
      const session = await requireAdmin();
      return { userId: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl, name: file.name, type: file.type };
    }),

  projectMedia: f({
    image: { maxFileSize: '10MB', maxFileCount: 15 }
  })
    .middleware(async () => {
      const session = await requireAdmin();
      return { userId: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl, name: file.name, type: file.type };
    })
};
