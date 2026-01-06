-- CreateEnum
CREATE TYPE "AccreditationType" AS ENUM ('NEWS', 'PARTNER', 'ACCREDITATION');

-- CreateEnum
CREATE TYPE "GalleryType" AS ENUM ('VISA_SUCCESS', 'REPRESENTATIVE', 'EVENT', 'OFFICE', 'STUDENT');

-- AlterTable
ALTER TABLE "Accreditation" ADD COLUMN     "type" "AccreditationType" NOT NULL DEFAULT 'NEWS';

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "type" "GalleryType" NOT NULL DEFAULT 'VISA_SUCCESS',
    "sortOrder" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryCountry" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "GalleryCountry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCountry_galleryId_countryId_key" ON "GalleryCountry"("galleryId", "countryId");

-- AddForeignKey
ALTER TABLE "GalleryCountry" ADD CONSTRAINT "GalleryCountry_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryCountry" ADD CONSTRAINT "GalleryCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
