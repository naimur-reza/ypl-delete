import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Trophy, DollarSign, MapPin } from "lucide-react";

// SSG with ISR - revalidate every hour
export const revalidate = 3600;
export const dynamicParams = true;

// Pre-generate first 30 universities at build time for instant loading
export async function generateStaticParams() {
  const universities = await prisma.university.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
    orderBy: { updatedAt: "desc" },
    take: 30,
  });

  return universities.map((university) => ({
    slug: university.slug,
  }));
}

// Components
import { UniversityHero } from "@/components/university/UniversityHero";
import { UniversityOverview } from "@/components/university/UniversityOverview";
import { UniversityServices } from "@/components/university/UniversityServices";
import { UniversityRankings } from "@/components/university/UniversityRankings";
import { UniversityEntryRequirements } from "@/components/university/UniversityEntryRequirements";
import { UniversityCostAndAccommodation } from "@/components/university/UniversityCostAndAccommodation";
import { UniversityCourses } from "@/components/university/UniversityCourses";
import { UniversityScholarships } from "@/components/university/UniversityScholarships";
import { UniversitySidebar } from "../components/university-sidebar";

import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";

import { fetchFaqsByContext } from "@/lib/faqs";
import { IntakeFeature } from "@/app/[country]/(public)/(home)/components";
import { ReviewSection } from "@/components/sections/review-section";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

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

  const university = await prisma.university.findFirst({
    where: { slug: slug, status: "ACTIVE" },
    select: {
      name: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
    },
  });

  if (!university) {
    return {
      title: "University Not Found",
    };
  }

  return {
    title: university.metaTitle || `${university.name} - Study in ${country}`,
    description:
      university.metaDescription ||
      `Learn about ${university.name}, its programs, rankings, and admission requirements.`,
    keywords:
      university.metaKeywords ||
      `Study in ${country}, ${university.name}, best universities in ${country}`,
  };
}

export default async function UniversityDetailsPage({ params }: PageProps) {
  const { country, slug } = await params;

  // Fetch country data for filtering
  const countryData = await prisma.country.findFirst({
    where: { slug: country },
    select: { id: true },
  });

  const university = await prisma.university.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      detail: true,
      courses: {
        where: { status: "ACTIVE" },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          duration: true,
          tuitionMin: true,
          tuitionMax: true,
          studyLevel: true,
          university: {
            select: {
              name: true,
              logo: true,
            },
          },
          intakes: {
            select: {
              intake: true,
            },
          },
        },
      },
      scholarships: {
        where: { status: "ACTIVE" },
      },
      destination: true,
      testimonials: {
        where: {
          testimonial: {
            status: "ACTIVE",
          },
        },
        include: {
          testimonial: true,
        },
      },
    },
  });

  if (!university) {
    notFound();
  }

  // Map testimonials to ReviewItem shape - filter for student reviews
  const reviews = university.testimonials
    .filter(
      (t) => t.testimonial.type === "STUDENT" || t.testimonial.type === "GMB",
    )
    .map((t) => ({
      id: t.testimonial.id,
      name: t.testimonial.name,
      message: t.testimonial.content || "",
      rating: t.testimonial.rating || 5,
      publishedAt: t.testimonial.createdAt,
      image: t.testimonial.avatar,
    }));

  // Filter for representative videos
  const representativeVideos = university.testimonials
    .filter(
      (t) => t.testimonial.type === "REPRESENTATIVE" && t.testimonial.videoUrl,
    )
    .map((t) => t.testimonial);

  // Fetch FAQs for this university
  const faqs = await fetchFaqsByContext(
    {
      universityId: university.id,
    },
    6,
  );

  // Define sidebar steps
  const sidebarSteps = [
    { id: "overview", label: "Overview" },
    university.detail?.servicesDescription
      ? { id: "services", label: "Services" }
      : null,
    university.detail?.ranking ? { id: "rankings", label: "Rankings" } : null,
    university.detail?.entryRequirements
      ? { id: "requirements", label: "Requirements" }
      : null,
    { id: "courses", label: "Courses" },
    { id: "scholarships", label: "Scholarships" },
    { id: "accommodation", label: "Cost & Accommodation" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <UniversityHero
        university={{
          name: university.name,
          thumbnail: university.thumbnail,
          logo: university.logo,
          address: university.address,
          website: university.website,
          famousFor: university.detail?.famousFor || null,
        }}
        countrySlug={country}
      />

      {/* Sticky Top Bar with Key Info */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {university.rankingNumber && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Ranking
                    </span>
                    <span className="font-bold text-slate-900">
                      {university.rankingNumber}
                    </span>
                  </div>
                </div>
              )}
              {university.costOfStudying && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Fees
                    </span>
                    <span className="font-bold text-blue-600">
                      {university.costOfStudying}
                    </span>
                  </div>
                </div>
              )}
              {university.destination && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Destination
                    </span>
                    <span className="font-bold text-slate-900">
                      {university.destination.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="sticky top-32">
              <UniversitySidebar steps={sidebarSteps} />

              {/* Sidebar CTA */}
              <div className="mt-6 p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Need Guidance?</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Our advisors can help you with {university.name}.
                  </p>
                  <CountryAwareLink href={`/apply-now`}>
                    <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                      Book Free Consultation
                    </button>
                  </CountryAwareLink>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <div className="space-y-8">
              {/* Overview Section */}
              {university.detail?.overview && (
                <section id="overview" className="scroll-mt-32">
                  <UniversityOverview overview={university.detail.overview} />
                </section>
              )}

              {/* Services Section */}
              {university.detail?.servicesDescription && (
                <section id="services" className="scroll-mt-32">
                  <UniversityServices
                    heading={university.detail?.servicesHeading}
                    description={university.detail?.servicesDescription}
                    image={
                      university.detail?.servicesImage ||
                      "https://thumbs.dreamstime.com/b/conceptual-hand-writing-showing-our-services-concept-meaning-occupation-function-serving-intangible-products-male-wear-160644151.jpg"
                    }
                  />
                </section>
              )}

              {/* Rankings */}
              {university.detail?.ranking && (
                <section id="rankings" className="scroll-mt-32">
                  <UniversityRankings ranking={university.detail.ranking} />
                </section>
              )}

              {/* Entry Requirements */}
              {university.detail?.entryRequirements && (
                <section id="requirements" className="scroll-mt-32">
                  <UniversityEntryRequirements
                    requirements={university.detail.entryRequirements}
                  />
                </section>
              )}

              {/* Courses List */}
              <section id="courses" className="scroll-mt-32">
                <UniversityCourses
                  courses={university.courses}
                  universitySlug={university.slug}
                  countrySlug={country}
                />
              </section>

              {/* Scholarships */}
              <section id="scholarships" className="scroll-mt-32">
                <UniversityScholarships
                  scholarships={university.scholarships}
                  countrySlug={country}
                />
              </section>

              {/* Cost & Accommodation */}
              <section id="accommodation" className="scroll-mt-32">
                <UniversityCostAndAccommodation
                  tuitionFees={university.detail?.tuitionFees}
                  accommodation={university.detail?.accommodation}
                  accommodationImage={university.detail?.accommodationImage}
                />
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Global Sections */}
      <div className="space-y-0">
        {/* Intake Admission Section */}
        <div className="bg-white">
          <IntakeFeature countrySlug={country} />
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-50">
          <FaqSection faqs={faqs} />
        </div>

        {/* Student Reviews */}
        {reviews.length > 0 && (
          <ReviewSection universityId={university.id} />
        )}

        {/* Representative Videos */}
        <RepresentativeVideoSlider videos={representativeVideos} />

        {/* CTA Banner */}
        <CallToActionBanner />
      </div>
    </div>
  );
}
