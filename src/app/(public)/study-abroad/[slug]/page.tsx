import { prisma } from "@/lib/prisma";
import { UniversityFilter } from "@/components/filters/university-filter";

import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import { ReviewSection } from "@/components/sections/review-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import {
  BlogSection,
  EventsSection,
  IntakeFeature,
  UniversitySlider,
} from "@/app/(public)/components";
import { fetchFaqsForDestinationsPage } from "@/lib/faqs";
import { StudyAbroadHero } from "../components/hero-section";
import { WhyChooseCountry } from "../components/why-choose-country";
import { PopularCourses } from "../components/popular-courses";
import { ScholarshipSlider } from "../components/scholarship-slider";
import { EssentialStudySection } from "../components/essential-study-section";

interface PageProps {
  params: Promise<{
    country: string;
    slug: string;
  }>;
}

const DestinationDetailsPage = async ({ params }: PageProps) => {
  const { country, slug } = await params;
  // Capitalize slug for display (e.g., "uk" -> "UK", "usa" -> "USA", "canada" -> "Canada")
  const countryName =
    slug.toUpperCase() === "UK" || slug.toUpperCase() === "USA"
      ? slug.toUpperCase()
      : slug.charAt(0).toUpperCase() + slug.slice(1);

  // Fetch destination with sections
  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      sections: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          content: true,
          displayOrder: true,
          isActive: true,
        },
      },
    },
  });

  // Fetch FAQs for destinations listing page (2+ destinations) or specific destination
  const faqs = await fetchFaqsForDestinationsPage(country, 6);

  const universities = await prisma.university.findMany({
    take: 10, // Limit for slider
  });

  // Fetch scholarships for this destination
  // TODO: Add "isActive: true" filter after running prisma db push
  const scholarships = await prisma.scholarship.findMany({
    where: {
      destination: {
        slug: slug,
      },
    },
    select: {
      id: true,
      title: true,
      description: true, // Use description until summary field is added
      slug: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="bg-white">
      <StudyAbroadHero />
      <UniversityFilter />
      <IntakeFeature />
      <WhyChooseCountry countryName={countryName} sections={destination?.sections || []} />
      <UniversitySlider universities={universities} />
      <PopularCourses countryName={countryName} destinationSlug={slug} />
      <ScholarshipSlider
        scholarships={scholarships}
        title={`Scholarships to Study in ${countryName}`}
      />
      <EssentialStudySection
        countryName={countryName}
        countryCode={country}
        destinationSlug={slug}
      />
      <ReviewSection />
      <RepresentativeVideoSlider />
      <EventsSection />
      <FaqSection faqs={faqs} />
      <BlogSection />
      <CallToActionBanner />
    </div>
  );
};

export default DestinationDetailsPage;

