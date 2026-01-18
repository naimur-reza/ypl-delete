-- AlterTable
ALTER TABLE "FAQ" ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "FAQEvent" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "FAQEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQCourse" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "FAQCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQScholarship" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,

    CONSTRAINT "FAQScholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQIntakePage" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "intakePageId" TEXT NOT NULL,

    CONSTRAINT "FAQIntakePage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FAQEvent_faqId_eventId_key" ON "FAQEvent"("faqId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "FAQCourse_faqId_courseId_key" ON "FAQCourse"("faqId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "FAQScholarship_faqId_scholarshipId_key" ON "FAQScholarship"("faqId", "scholarshipId");

-- CreateIndex
CREATE UNIQUE INDEX "FAQIntakePage_faqId_intakePageId_key" ON "FAQIntakePage"("faqId", "intakePageId");

-- AddForeignKey
ALTER TABLE "FAQEvent" ADD CONSTRAINT "FAQEvent_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQEvent" ADD CONSTRAINT "FAQEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQCourse" ADD CONSTRAINT "FAQCourse_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQCourse" ADD CONSTRAINT "FAQCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQScholarship" ADD CONSTRAINT "FAQScholarship_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQScholarship" ADD CONSTRAINT "FAQScholarship_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQIntakePage" ADD CONSTRAINT "FAQIntakePage_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQIntakePage" ADD CONSTRAINT "FAQIntakePage_intakePageId_fkey" FOREIGN KEY ("intakePageId") REFERENCES "IntakePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
