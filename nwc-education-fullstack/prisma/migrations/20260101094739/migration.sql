-- AlterTable
ALTER TABLE "IntakePage" ADD COLUMN     "heroCTALabel" TEXT,
ADD COLUMN     "heroCTAUrl" TEXT,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "whyChooseDescription" TEXT,
ADD COLUMN     "whyChooseTitle" TEXT;

-- CreateTable
CREATE TABLE "IntakeSeason" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "intake" "IntakeMonth" NOT NULL,
    "year" INTEGER NOT NULL,
    "backgroundImage" TEXT,
    "ctaLabel" TEXT DEFAULT 'Apply Now',
    "ctaUrl" TEXT DEFAULT '/apply-now',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "applicationDeadline" TIMESTAMP(3),
    "intakeStartDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeSeasonCountry" (
    "id" TEXT NOT NULL,
    "intakeSeasonId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "IntakeSeasonCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakePageBenefit" (
    "id" TEXT NOT NULL,
    "intakePageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "IntakePageBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntakeSeason_isActive_idx" ON "IntakeSeason"("isActive");

-- CreateIndex
CREATE INDEX "IntakeSeason_intake_year_idx" ON "IntakeSeason"("intake", "year");

-- CreateIndex
CREATE UNIQUE INDEX "IntakeSeasonCountry_intakeSeasonId_countryId_key" ON "IntakeSeasonCountry"("intakeSeasonId", "countryId");

-- CreateIndex
CREATE INDEX "IntakePageBenefit_intakePageId_idx" ON "IntakePageBenefit"("intakePageId");

-- CreateIndex
CREATE INDEX "IntakePage_isActive_idx" ON "IntakePage"("isActive");

-- AddForeignKey
ALTER TABLE "IntakeSeasonCountry" ADD CONSTRAINT "IntakeSeasonCountry_intakeSeasonId_fkey" FOREIGN KEY ("intakeSeasonId") REFERENCES "IntakeSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeSeasonCountry" ADD CONSTRAINT "IntakeSeasonCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakePageBenefit" ADD CONSTRAINT "IntakePageBenefit_intakePageId_fkey" FOREIGN KEY ("intakePageId") REFERENCES "IntakePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
