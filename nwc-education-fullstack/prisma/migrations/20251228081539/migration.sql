/*
  Warnings:

  - You are about to drop the column `accrediationId` on the `AccreditationCountry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accreditationId,countryId]` on the table `AccreditationCountry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accreditationId` to the `AccreditationCountry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccreditationCountry" DROP CONSTRAINT "AccreditationCountry_accrediationId_fkey";

-- DropIndex
DROP INDEX "AccreditationCountry_accrediationId_countryId_key";

-- AlterTable
ALTER TABLE "AccreditationCountry" DROP COLUMN "accrediationId",
ADD COLUMN     "accreditationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AccreditationCountry_accreditationId_countryId_key" ON "AccreditationCountry"("accreditationId", "countryId");

-- AddForeignKey
ALTER TABLE "AccreditationCountry" ADD CONSTRAINT "AccreditationCountry_accreditationId_fkey" FOREIGN KEY ("accreditationId") REFERENCES "Accreditation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
