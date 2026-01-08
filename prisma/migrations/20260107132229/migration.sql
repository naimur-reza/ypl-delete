-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "footerDestinations" JSONB,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "contactAddress" TEXT,
    "quickLinks" JSONB,
    "socialFacebook" TEXT,
    "socialYoutube" TEXT,
    "socialLinkedin" TEXT,
    "socialTwitter" TEXT,
    "socialInstagram" TEXT,
    "privacyPolicyUrl" TEXT,
    "termsOfServiceUrl" TEXT,
    "cookiePolicyUrl" TEXT,
    "footerDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_key_key" ON "Settings"("key");

