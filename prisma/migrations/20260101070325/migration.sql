-- CreateEnum
CREATE TYPE "BackgroundType" AS ENUM ('IMAGE', 'VIDEO', 'YOUTUBE');

-- AlterTable
ALTER TABLE "UniversityDetail" ADD COLUMN     "accommodation" TEXT,
ADD COLUMN     "accommodationImage" TEXT,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "buttonText" TEXT,
    "buttonUrl" TEXT,
    "backgroundType" "BackgroundType" NOT NULL DEFAULT 'IMAGE',
    "backgroundUrl" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroCountry" (
    "id" TEXT NOT NULL,
    "heroId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "HeroCountry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hero_slug_idx" ON "Hero"("slug");

-- CreateIndex
CREATE INDEX "Hero_isActive_idx" ON "Hero"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "HeroCountry_heroId_countryId_key" ON "HeroCountry"("heroId", "countryId");

-- AddForeignKey
ALTER TABLE "HeroCountry" ADD CONSTRAINT "HeroCountry_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroCountry" ADD CONSTRAINT "HeroCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
