-- Add category to Project
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'Rinovime';
CREATE INDEX IF NOT EXISTS "Project_category_idx" ON "Project"("category");

-- Create Review table
CREATE TABLE IF NOT EXISTS "Review" (
  "id" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Review_approved_idx" ON "Review"("approved");
CREATE INDEX IF NOT EXISTS "Review_createdAt_idx" ON "Review"("createdAt");
