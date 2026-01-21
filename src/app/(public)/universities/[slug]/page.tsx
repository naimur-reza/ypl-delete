import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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

import { ReviewSlider } from "@/components/sections/review-slider";

import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";

import { fetchFaqsByContext } from "@/lib/faqs";
import { IntakeFeature } from "@/app/[country]/(public)/(home)/components";

 

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
      // country: true, // Removed as it is not a direct relation
      courses: {
        where: { status: "ACTIVE" },
        take: 10,
        include: {
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
      ? { id: "requirements", label: "Entry Requirements" }
      : null,
    { id: "courses", label: "Courses" },
    { id: "scholarships", label: "Scholarships" },
    { id: "accommodation", label: "Cost & Accommodation" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. University Info / Hero Section */}
      <UniversityHero
        university={{
          name: university.name,
          thumbnail: university.thumbnail,
          logo: university.logo,
          address: university.address,
          website: university.website,
          fees: university.detail?.tuitionFees || "Contact for info",
          ranking: university.detail?.ranking || "N/A",
          established: "1900", // Placeholder as field missing in schema
          famousFor: university.detail?.famousFor || "Excellence in Education",
          rankingNumber: university.rankingNumber ?? "N/A",
          costOfStudying: university.costOfStudying ?? undefined,
        }}
      />

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <UniversitySidebar steps={sidebarSteps} />
          </aside>

          {/* Content Area */}
          <div className="flex-1 space-y-16">
            {/* 2. Overview Section */}
            {university.detail?.overview && (
              <section id="overview" className="scroll-mt-32">
                <UniversityOverview overview={university.detail.overview} />
              </section>
            )}

            {/* 3. Services Section */}
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

            {/* 4. Rankings Details */}
            {university.detail?.ranking && (
              <section id="rankings" className="scroll-mt-32">
                <UniversityRankings ranking={university.detail.ranking} />
              </section>
            )}

            {/* 5. Entry Requirements */}
            {university.detail?.entryRequirements && (
              <section id="requirements" className="scroll-mt-32">
                <UniversityEntryRequirements
                  requirements={university.detail.entryRequirements}
                />
              </section>
            )}

            {/* 7. Courses List */}
            <section id="courses" className="scroll-mt-32">
              <UniversityCourses
                courses={university.courses}
                universitySlug={university.slug}
                countrySlug={country}
              />
            </section>

            {/* 8. Scholarships List */}
            <section id="scholarships" className="scroll-mt-32">
              <UniversityScholarships
                scholarships={university.scholarships}
                countrySlug={country}
              />
            </section>

            {/* 6. Cost of Studying & Accommodation */}
            <section id="accommodation" className="scroll-mt-32">
              <UniversityCostAndAccommodation
                tuitionFees={university.detail?.tuitionFees}
                accommodation={university.detail?.accommodation}
                accommodationImage={university.detail?.accommodationImage}
              />
            </section>
          </div>
        </div>
      </div>

      {/* 9. Intake Admission Section CTR */}
      <IntakeFeature countrySlug={country} />

      {/* 10. Student Review Video Slider */}
      {reviews.length > 0 && (
        <div className="container mx-auto">
          <ReviewSlider title="Student Reviews" items={reviews} type="text" />
        </div>
      )}

      {/* 12. FAQ */}
      <FaqSection faqs={faqs} />

      {/* 13. Representative Video Slider */}
      <RepresentativeVideoSlider videos={representativeVideos} />

      {/* 14. Book free counselling CTR Section */}
      <CallToActionBanner />
    </main>
  );
}
