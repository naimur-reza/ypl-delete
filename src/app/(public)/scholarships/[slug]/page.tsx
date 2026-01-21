import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Share2 } from "lucide-react";
import Image from "next/image";

// SSG with ISR - revalidate every hour
export const revalidate = 3600;
export const dynamicParams = true;

// Pre-generate first 30 scholarships at build time for instant loading
export async function generateStaticParams() {
  const scholarships = await prisma.scholarship.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return scholarships.map((scholarship) => ({
    slug: scholarship.slug,
  }));
}

// Reusable Components
import { IntakeFeature } from "@/app/(public)/components";
import { ReviewSection } from "@/components/sections/review-section";
import { FaqSection } from "@/components/sections/faq-section";
import { BlogSlider } from "../../blogs/components/blog-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { fetchFaqsByContext } from "@/lib/faqs";
import { ScholarshipSidebar } from "@/app/[country]/(public)/scholarships/[slug]/components/scholarship-sidebar";
import { ScholarshipOverview } from "@/app/[country]/(public)/scholarships/[slug]/components/scholarship-overview";
import { ScholarshipBenefits } from "@/app/[country]/(public)/scholarships/[slug]/components/scholarship-benefits";
import { ScholarshipEligibility } from "@/app/[country]/(public)/scholarships/[slug]/components/scholarship-eligibility";
import { ScholarshipLevelField } from "@/app/[country]/(public)/scholarships/[slug]/components/scholarship-level-field";
import { ScholarshipProvider } from "@/app/[country]/(public)/scholarships/[slug]/components/scholarship-provider";
import { ScholarshipDocuments } from "@/app/[country]/(public)/scholarships/[slug]/components/scholarship-documents";
import { ScholarshipHowToApply } from "@/app/[country]/(public)/scholarships/[slug]/components/scholarship-how-to-apply";
import { RelatedScholarships } from "@/app/[country]/(public)/scholarships/[slug]/components/related-scholarships";

// Scholarship Components

interface PageProps {
  params: Promise<{
    country: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country, slug } = await params;

  const scholarship = await prisma.scholarship.findFirst({
    where: { slug, status: "ACTIVE" },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
    },
  });

  if (!scholarship) {
    return {
      title: "Scholarship Not Found",
    };
  }

  return {
    title:
      scholarship.metaTitle ||
      `${scholarship.title} - Scholarships in ${country}`,
    description:
      scholarship.metaDescription ||
      `Learn about ${scholarship.title}, eligibility, benefits, and how to apply.`,
    keywords:
      scholarship.metaKeywords ||
      `Scholarship, ${scholarship.title}, Study in ${country}`,
  };
}

export default async function ScholarshipDetailsPage({ params }: PageProps) {
  const { country, slug } = await params;

  // Fetch country ID for filtering
  const countryData = await prisma.country.findFirst({
    where: { slug: country },
    select: { id: true },
  });

  const scholarshipData = await prisma.scholarship.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      university: {
        select: {
          id: true,
          name: true,
          logo: true,
          slug: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  const scholarship = scholarshipData as
    | (typeof scholarshipData & {
        overview?: string | null;
        benefits?: string | null;
        eligibilityCriteria?: string | null;
        levelAndField?: string | null;
        providerInfo?: string | null;
        requiredDocuments?: string | null;
        howToApply?: string | null;
        image?: string | null;
      })
    | null; // Type assertion until Prisma client is regenerated with new fields

  if (!scholarship) {
    notFound();
  }

  // Fetch related scholarships (same destination, exclude current)
  const relatedScholarships = await prisma.scholarship.findMany({
    where: {
      status: "ACTIVE",
      destinationId: scholarship.destinationId,
      id: { not: scholarship.id },
    },
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      amount: true,
    },
  });

  // Sidebar steps
  const sidebarSteps = [
    { id: "overview", label: "Overview / About the Scholarship" },
    { id: "benefits", label: "Scholarship Value / Benefits" },
    { id: "eligibility", label: "Eligibility Criteria" },
    { id: "level-field", label: "Level & Field of Study" },
    { id: "provider", label: "Host University / Provider Info" },
    { id: "documents", label: "Required Documents" },
    { id: "how-to-apply", label: "How to Apply" },
  ];

  // Fetch FAQs for this scholarship (with fallback to destination/university)
  const faqs = await fetchFaqsByContext(
    {
      scholarshipId: scholarship.id,
      destinationId: scholarship.destinationId,
      universityId: scholarship.universityId || undefined,
    },
    6,
  );

  const posts = await prisma.blog.findMany({
    where: {
      countries: {
        some: {
          country: { slug: country },
        },
      },
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-120 w-full overflow-hidden">
        <Image
          src={
            scholarship.image ||
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=100&w=1400&auto=format&fit=crop"
          }
          alt={scholarship.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link
              href={`/${country}`}
              className="hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/${country}/scholarships`}
              className="hover:text-white transition-colors"
            >
              Scholarships
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{scholarship.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight mb-4">
            {scholarship.title}
          </h1>
          {scholarship.description && (
            <p className="text-xl text-white/90 max-w-3xl">
              {scholarship.description}
            </p>
          )}
        </div>
      </div>

      {/* Top Bar with Key Info */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {scholarship.amount && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-sm">Amount:</span>
                  <span className="font-bold text-primary text-lg">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(scholarship.amount)}
                  </span>
                </div>
              )}
              {scholarship.deadline && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-sm">Deadline:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(scholarship.deadline).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
              )}
              {scholarship.university && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-sm">University:</span>
                  <Link
                    href={`/${country}/universities/${scholarship.university.slug}`}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {scholarship.university.name}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors shadow-sm">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <ScholarshipSidebar steps={sidebarSteps} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="space-y-12">
              {/* Overview / About the Scholarship */}
              {scholarship.overview && (
                <section id="overview" className="scroll-mt-24">
                  <ScholarshipOverview content={scholarship.overview} />
                </section>
              )}

              {/* Scholarship Value / Benefits */}
              {scholarship.benefits && (
                <section id="benefits" className="scroll-mt-24">
                  <ScholarshipBenefits content={scholarship.benefits} />
                </section>
              )}

              {/* Eligibility Criteria */}
              {scholarship.eligibilityCriteria && (
                <section id="eligibility" className="scroll-mt-24">
                  <ScholarshipEligibility
                    content={scholarship.eligibilityCriteria}
                  />
                </section>
              )}

              {/* Level & Field of Study */}
              {scholarship.levelAndField && (
                <section id="level-field" className="scroll-mt-24">
                  <ScholarshipLevelField content={scholarship.levelAndField} />
                </section>
              )}

              {/* Host University / Provider Info */}
              {scholarship.providerInfo && (
                <section id="provider" className="scroll-mt-24">
                  <ScholarshipProvider content={scholarship.providerInfo} />
                </section>
              )}

              {/* Required Documents */}
              {scholarship.requiredDocuments && (
                <section id="documents" className="scroll-mt-24">
                  <ScholarshipDocuments
                    content={scholarship.requiredDocuments}
                  />
                </section>
              )}

              {/* How to Apply */}
              {scholarship.howToApply && (
                <section id="how-to-apply" className="scroll-mt-24">
                  <ScholarshipHowToApply content={scholarship.howToApply} />
                </section>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Section Part - Below Main Content */}
      <div className="bg-white">
        {/* Intake Admission Section CTR */}
        <IntakeFeature countrySlug={country} />

        {/* FAQ */}
        <FaqSection faqs={faqs} />

        {/* Student Review Video Slider + Google My Business Review Slider */}
        <ReviewSection countrySlug={country} />

        {/* Related Scholarships Section */}
        {relatedScholarships.length > 0 && (
          <RelatedScholarships
            scholarships={relatedScholarships}
            countrySlug={country}
          />
        )}

        <BlogSlider countrySlug={slug} posts={posts} />

        {/* Book free counselling CTR Section */}
        <CallToActionBanner />

        {/* Article Related Scholarships */}
      </div>
    </div>
  );
}
