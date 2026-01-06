-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('UNIVERSITY', 'GOVERNMENT', 'PRIVATE', 'EMBASSY');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('EXPO', 'WEBINAR', 'ADMISSION_DAY', 'OPEN_DAY', 'SEMINAR', 'WORKSHOP');

-- CreateEnum
CREATE TYPE "IntakeMonth" AS ENUM ('JANUARY', 'MAY', 'SEPTEMBER');

-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('GMB', 'STUDENT', 'OTHER');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TestimonialType" AS ENUM ('STUDENT', 'REPRESENTATIVE', 'GMB');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'TEXT_ONLY');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "countryId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "preferredAt" TIMESTAMP(3),
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "image" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "destinationId" TEXT NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "image" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accreditation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accreditation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "department" TEXT,
    "location" TEXT,
    "jobType" TEXT,
    "jobLocation" TEXT,
    "description" TEXT,
    "requirements" TEXT,
    "responsibilities" TEXT,
    "benefits" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT DEFAULT 'USD',
    "applyUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "careerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "coverLetter" TEXT,
    "resumeUrl" TEXT,
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "currentCompany" TEXT,
    "yearsOfExperience" INTEGER,
    "expectedSalary" TEXT,
    "availableFrom" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT,
    "tuitionMin" DOUBLE PRECISION,
    "tuitionMax" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "sections" JSONB,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "universityId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseIntake" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "intake" "IntakeMonth" NOT NULL,

    CONSTRAINT "CourseIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakePage" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "intake" "IntakeMonth" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "heroMedia" TEXT,
    "eligibility" TEXT,
    "timelineJson" JSONB,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "gallery" TEXT[],
    "video" TEXT,
    "eventType" "EventType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "location" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "registrationLink" TEXT,
    "registrationButtonText" TEXT,
    "isRegistrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "destinationId" TEXT NOT NULL,
    "universityId" TEXT,
    "successSummary" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventMedia" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "caption" TEXT,
    "sortOrder" INTEGER DEFAULT 0,

    CONSTRAINT "EventMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "countryId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "countryId" TEXT,
    "destinationId" TEXT,
    "interestJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferRequest" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalOffice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "slug" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "mapEmbedUrl" TEXT,
    "openingHours" JSONB,
    "content" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "flag" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "heroTitle" TEXT,
    "thumbnail" TEXT,
    "heroSubtitle" TEXT,
    "whyChoose" TEXT,
    "topUniversities" TEXT,
    "campusAndCommunity" TEXT,
    "destinationLife" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EssentialStudy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "destinationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EssentialStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityCountry" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "UniversityCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseCountry" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "CourseCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipCountry" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "ScholarshipCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCountry" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "EventCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCountry" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "BlogCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogUniversity" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "BlogUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCourse" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "BlogCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQCountry" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "FAQCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQDestination" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,

    CONSTRAINT "FAQDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQUniversity" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "FAQUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalOfficeCountry" (
    "id" TEXT NOT NULL,
    "globalOfficeId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "GlobalOfficeCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationCountry" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "DestinationCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialCountry" (
    "id" TEXT NOT NULL,
    "testimonialId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "TestimonialCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialDestination" (
    "id" TEXT NOT NULL,
    "testimonialId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,

    CONSTRAINT "TestimonialDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialUniversity" (
    "id" TEXT NOT NULL,
    "testimonialId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "TestimonialUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialEvent" (
    "id" TEXT NOT NULL,
    "testimonialId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "TestimonialEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "amount" DOUBLE PRECISION,
    "deadline" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "overview" TEXT,
    "benefits" TEXT,
    "eligibilityCriteria" TEXT,
    "levelAndField" TEXT,
    "providerInfo" TEXT,
    "requiredDocuments" TEXT,
    "howToApply" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "universityId" TEXT,
    "destinationId" TEXT NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "type" "TestimonialType" NOT NULL DEFAULT 'STUDENT',
    "mediaType" "MediaType" NOT NULL DEFAULT 'TEXT_ONLY',
    "name" TEXT NOT NULL,
    "role" TEXT,
    "content" TEXT,
    "rating" INTEGER,
    "avatar" TEXT,
    "videoUrl" TEXT,
    "url" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "thumbnail" TEXT,
    "description" TEXT,
    "providerType" "ProviderType" NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "website" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "destinationId" TEXT NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityDetail" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "ranking" TEXT,
    "tuitionFees" TEXT,
    "famousFor" TEXT,
    "servicesHeading" TEXT,
    "servicesDescription" TEXT,
    "servicesImage" TEXT,
    "entryRequirements" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccreditationToCountry" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AccreditationToCountry_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseToScholarship" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToScholarship_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Appointment_eventId_idx" ON "Appointment"("eventId");

-- CreateIndex
CREATE INDEX "Appointment_countryId_idx" ON "Appointment"("countryId");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_destinationId_idx" ON "Blog"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Career_slug_key" ON "Career"("slug");

-- CreateIndex
CREATE INDEX "JobApplication_careerId_idx" ON "JobApplication"("careerId");

-- CreateIndex
CREATE INDEX "JobApplication_email_idx" ON "JobApplication"("email");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Course_universityId_idx" ON "Course"("universityId");

-- CreateIndex
CREATE INDEX "Course_destinationId_idx" ON "Course"("destinationId");

-- CreateIndex
CREATE INDEX "Course_isActive_idx" ON "Course"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "CourseIntake_courseId_intake_key" ON "CourseIntake"("courseId", "intake");

-- CreateIndex
CREATE UNIQUE INDEX "IntakePage_destinationId_intake_key" ON "IntakePage"("destinationId", "intake");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_destinationId_idx" ON "Event"("destinationId");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");

-- CreateIndex
CREATE INDEX "EventRegistration_countryId_idx" ON "EventRegistration"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalOffice_name_key" ON "GlobalOffice"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalOffice_slug_key" ON "GlobalOffice"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Country_slug_key" ON "Country"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Country_isoCode_key" ON "Country"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EssentialStudy_slug_key" ON "EssentialStudy"("slug");

-- CreateIndex
CREATE INDEX "EssentialStudy_destinationId_idx" ON "EssentialStudy"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityCountry_universityId_countryId_key" ON "UniversityCountry"("universityId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCountry_courseId_countryId_key" ON "CourseCountry"("courseId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipCountry_scholarshipId_countryId_key" ON "ScholarshipCountry"("scholarshipId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "EventCountry_eventId_countryId_key" ON "EventCountry"("eventId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCountry_blogId_countryId_key" ON "BlogCountry"("blogId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogUniversity_blogId_universityId_key" ON "BlogUniversity"("blogId", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCourse_blogId_courseId_key" ON "BlogCourse"("blogId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "FAQCountry_faqId_countryId_key" ON "FAQCountry"("faqId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "FAQDestination_faqId_destinationId_key" ON "FAQDestination"("faqId", "destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "FAQUniversity_faqId_universityId_key" ON "FAQUniversity"("faqId", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalOfficeCountry_globalOfficeId_countryId_key" ON "GlobalOfficeCountry"("globalOfficeId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationCountry_destinationId_countryId_key" ON "DestinationCountry"("destinationId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialCountry_testimonialId_countryId_key" ON "TestimonialCountry"("testimonialId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialDestination_testimonialId_destinationId_key" ON "TestimonialDestination"("testimonialId", "destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialUniversity_testimonialId_universityId_key" ON "TestimonialUniversity"("testimonialId", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialEvent_testimonialId_eventId_key" ON "TestimonialEvent"("testimonialId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_slug_key" ON "Scholarship"("slug");

-- CreateIndex
CREATE INDEX "Scholarship_destinationId_idx" ON "Scholarship"("destinationId");

-- CreateIndex
CREATE INDEX "Scholarship_universityId_idx" ON "Scholarship"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE INDEX "University_destinationId_idx" ON "University"("destinationId");

-- CreateIndex
CREATE INDEX "University_isFeatured_isActive_idx" ON "University"("isFeatured", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityDetail_universityId_key" ON "UniversityDetail"("universityId");

-- CreateIndex
CREATE INDEX "UniversityDetail_universityId_idx" ON "UniversityDetail"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_AccreditationToCountry_B_index" ON "_AccreditationToCountry"("B");

-- CreateIndex
CREATE INDEX "_CourseToScholarship_B_index" ON "_CourseToScholarship"("B");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseIntake" ADD CONSTRAINT "CourseIntake_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakePage" ADD CONSTRAINT "IntakePage_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMedia" ADD CONSTRAINT "EventMedia_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferRequest" ADD CONSTRAINT "OfferRequest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssentialStudy" ADD CONSTRAINT "EssentialStudy_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityCountry" ADD CONSTRAINT "UniversityCountry_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityCountry" ADD CONSTRAINT "UniversityCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCountry" ADD CONSTRAINT "CourseCountry_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCountry" ADD CONSTRAINT "CourseCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipCountry" ADD CONSTRAINT "ScholarshipCountry_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipCountry" ADD CONSTRAINT "ScholarshipCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCountry" ADD CONSTRAINT "EventCountry_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCountry" ADD CONSTRAINT "EventCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCountry" ADD CONSTRAINT "BlogCountry_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCountry" ADD CONSTRAINT "BlogCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogUniversity" ADD CONSTRAINT "BlogUniversity_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogUniversity" ADD CONSTRAINT "BlogUniversity_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCourse" ADD CONSTRAINT "BlogCourse_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCourse" ADD CONSTRAINT "BlogCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQCountry" ADD CONSTRAINT "FAQCountry_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQCountry" ADD CONSTRAINT "FAQCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQDestination" ADD CONSTRAINT "FAQDestination_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQDestination" ADD CONSTRAINT "FAQDestination_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQUniversity" ADD CONSTRAINT "FAQUniversity_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQUniversity" ADD CONSTRAINT "FAQUniversity_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalOfficeCountry" ADD CONSTRAINT "GlobalOfficeCountry_globalOfficeId_fkey" FOREIGN KEY ("globalOfficeId") REFERENCES "GlobalOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalOfficeCountry" ADD CONSTRAINT "GlobalOfficeCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationCountry" ADD CONSTRAINT "DestinationCountry_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationCountry" ADD CONSTRAINT "DestinationCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialCountry" ADD CONSTRAINT "TestimonialCountry_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialCountry" ADD CONSTRAINT "TestimonialCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialDestination" ADD CONSTRAINT "TestimonialDestination_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialDestination" ADD CONSTRAINT "TestimonialDestination_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialUniversity" ADD CONSTRAINT "TestimonialUniversity_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialUniversity" ADD CONSTRAINT "TestimonialUniversity_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialEvent" ADD CONSTRAINT "TestimonialEvent_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialEvent" ADD CONSTRAINT "TestimonialEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityDetail" ADD CONSTRAINT "UniversityDetail_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccreditationToCountry" ADD CONSTRAINT "_AccreditationToCountry_A_fkey" FOREIGN KEY ("A") REFERENCES "Accreditation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccreditationToCountry" ADD CONSTRAINT "_AccreditationToCountry_B_fkey" FOREIGN KEY ("B") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToScholarship" ADD CONSTRAINT "_CourseToScholarship_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToScholarship" ADD CONSTRAINT "_CourseToScholarship_B_fkey" FOREIGN KEY ("B") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
