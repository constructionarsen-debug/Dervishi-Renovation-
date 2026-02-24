-- DropIndex
DROP INDEX "QuestionMessage_questionId_idx";

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "updatedAt" DROP DEFAULT;
