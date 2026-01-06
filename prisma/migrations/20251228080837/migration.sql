/*
  Warnings:

  - You are about to drop the `_AccreditationToCountry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AccreditationToCountry" DROP CONSTRAINT "_AccreditationToCountry_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccreditationToCountry" DROP CONSTRAINT "_AccreditationToCountry_B_fkey";

-- DropTable
DROP TABLE "_AccreditationToCountry";

-- CreateTable
CREATE TABLE "AccreditationCountry" (
    "id" TEXT NOT NULL,
    "accrediationId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "AccreditationCountry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccreditationCountry_accrediationId_countryId_key" ON "AccreditationCountry"("accrediationId", "countryId");

-- AddForeignKey
ALTER TABLE "AccreditationCountry" ADD CONSTRAINT "AccreditationCountry_accrediationId_fkey" FOREIGN KEY ("accrediationId") REFERENCES "Accreditation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccreditationCountry" ADD CONSTRAINT "AccreditationCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
