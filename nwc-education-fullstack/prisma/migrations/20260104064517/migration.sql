-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "section" TEXT NOT NULL,
    "slideIndex" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatCountry" (
    "id" TEXT NOT NULL,
    "statId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "StatCountry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stat_section_idx" ON "Stat"("section");

-- CreateIndex
CREATE INDEX "Stat_isActive_idx" ON "Stat"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "StatCountry_statId_countryId_key" ON "StatCountry"("statId", "countryId");

-- AddForeignKey
ALTER TABLE "StatCountry" ADD CONSTRAINT "StatCountry_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatCountry" ADD CONSTRAINT "StatCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
