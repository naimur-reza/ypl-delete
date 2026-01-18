-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "summary" TEXT;
