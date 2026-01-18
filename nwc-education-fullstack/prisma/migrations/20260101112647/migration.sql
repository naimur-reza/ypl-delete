-- CreateTable
CREATE TABLE "DestinationSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "content" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "destinationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DestinationSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DestinationSection_destinationId_idx" ON "DestinationSection"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationSection_destinationId_slug_key" ON "DestinationSection"("destinationId", "slug");

-- AddForeignKey
ALTER TABLE "DestinationSection" ADD CONSTRAINT "DestinationSection_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
