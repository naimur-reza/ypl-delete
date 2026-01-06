import { prisma } from "@/lib/prisma";
import { UniversityFilter } from "@/components/filters/university-filter";

import { UniversitySlider } from "../../(home)/components/university-slider";
import EventsSection from "../../(home)/components/event-section";
import BlogSection from "../../(home)/components/latest-blogs";
import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import { ReviewSection } from "@/components/sections/review-section";
import CallToActionBanner from "@/components/CallToActionBanner";

import { IntakeFeature } from "@/app/(public)/components";
import { fetchFaqsForDestinationsPage } from "@/lib/faqs";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudyAbroadHero } from "@/app/(public)/study-abroad/components/hero-section";
import { WhyChooseCountry } from "@/app/(public)/study-abroad/components/why-choose-country";
import { PopularCourses } from "@/app/(public)/study-abroad/components/popular-courses";
import { ScholarshipSection } from "@/app/(public)/study-abroad/components/scholarship-section";
import { EssentialStudySection } from "@/app/(public)/study-abroad/components/essential-study-section";

interface PageProps {
  params: Promise<{
    country: string;
    slug: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;

  const destination = await prisma.destination.findUnique({
    where: { slug },
    select: {
      name: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
    },
  });

  if (!destination) return {};

  return buildMetadata({
    title: destination.metaTitle || destination.name,
    description: destination.metaDescription || undefined,
    keywords: destination.metaKeywords || undefined,
    url: `/study-abroad/${slug}`,
  });
};

const DestinationDetailsPage = async ({ params }: PageProps) => {
  const { country, slug } = await params;
  // Capitalize slug for display (e.g., "uk" -> "UK", "usa" -> "USA", "canada" -> "Canada")
  const countryName =
    slug.toUpperCase() === "UK" || slug.toUpperCase() === "USA"
      ? slug.toUpperCase()
      : slug.charAt(0).toUpperCase() + slug.slice(1);

  // Find destination by slug
  const destination = await prisma.destination.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });

  if (!destination) {
    notFound();
  }

  // Fetch FAQs for destinations listing page (2+ destinations) or specific destination
  const faqs = await fetchFaqsForDestinationsPage(country, 6);

  const universities = await prisma.university.findMany({
    take: 10, // Limit for slider
  });

  return (
    <div className="bg-white">
      <StudyAbroadHero />
      <UniversityFilter />
      <IntakeFeature />
      <WhyChooseCountry countryName={countryName} />
      <UniversitySlider universities={universities} />
      <PopularCourses countrySlug={country} />
      <ScholarshipSection countryName={countryName} />
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
