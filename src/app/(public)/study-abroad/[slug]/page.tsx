import { prisma } from "@/lib/prisma";
import { UniversityFilter } from "@/components/filters/university-filter";

export const revalidate = 3600;

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
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { UniversityFilterWithWizard } from "@/components/filters/university-filter-with-wizard";

interface PageProps {
  params: Promise<{
    country?: string; // Optional - only available when accessed from country route
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trimmedSlug = slug.trim();

  const destination = await prisma.destination.findFirst({
    where: {
      slug: {
        contains: trimmedSlug,
      },
    },
    select: {
      name: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      thumbnail: true,
    },
  });

  if (!destination) {
    return buildMetadata({
      title: "Study Abroad",
      description: "Explore study abroad destinations with NWC Education.",
    });
  }

  const countryName =
    trimmedSlug.toUpperCase() === "UK" || trimmedSlug.toUpperCase() === "USA"
      ? trimmedSlug.toUpperCase()
      : trimmedSlug.charAt(0).toUpperCase() + trimmedSlug.slice(1);

  return buildMetadata({
    title: destination.metaTitle || `Study in ${countryName} - NWC Education`,
    description:
      destination.metaDescription ||
      `Discover top universities, scholarships, and courses to study in ${countryName}. Get expert guidance from NWC Education.`,
    keywords: destination.metaKeywords,
    images: destination.thumbnail,
    url: `/study-abroad/${trimmedSlug}`,
  });
}

const DestinationDetailsPage = async ({ params }: PageProps) => {
  const { country, slug } = await params;

  // Trim slug to handle any whitespace issues in database
  const trimmedSlug = slug.trim();
  // Capitalize slug for display (e.g., "uk" -> "UK", "usa" -> "USA", "canada" -> "Canada")
  const countryName =
    trimmedSlug.toUpperCase() === "UK" || trimmedSlug.toUpperCase() === "USA"
      ? trimmedSlug.toUpperCase()
      : trimmedSlug.charAt(0).toUpperCase() + trimmedSlug.slice(1);
  
  // Extract country slug from URL if available (lowercase for filtering)
  const countrySlug = country ? country.toLowerCase() : null;

  // Fetch destination with sections
  const destination = await prisma.destination.findFirst({
    where: {
      slug: {
        contains: trimmedSlug,
      },
    },
    include: {
      sections: {
        where: { status: "ACTIVE" },
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          content: true,
          displayOrder: true,
          status: true,
        },
      },
    },
  });

  // Fetch FAQs for destinations listing page (2+ destinations) or specific destination
  const faqs = await fetchFaqsForDestinationsPage(country || null, 6);

  const universities = await prisma.university.findMany({
    where: {
      status: "ACTIVE",
      destination: {
id: destination?.id
      },
    },
    take: 10, // Limit for slider
  });

  // Fetch scholarships for this destination
  const scholarships = await prisma.scholarship.findMany({
    where: {
      status: "ACTIVE",
      destination: {
        id: destination?.id,
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

  // Clean destination name by removing "Study in" prefix
  const cleanDestinationName = (name: string | undefined) => {
    if (!name) return countryName;
    return name.replace(/^Study\s+in\s+/i, '').trim();
  };

  const countries = await prisma.country.findMany({});
  const destinations = await prisma.destination.findMany({
    where: countrySlug
      ? {
          countries: {
            some: {
              country: {
                slug: countrySlug,
              },
            },
          },
        }
      : undefined,
  });

  return (
    <div className="bg-white">
      <StudyAbroadHero
        countrySlug={countrySlug || undefined}
      />
      <UniversityFilterWithWizard
        countries={countries}
        destinations={destinations}
      />
      <IntakeFeature />
      <WhyChooseCountry
        countryName={cleanDestinationName(destination?.name)}
        sections={destination?.sections || []}
      />
      <UniversitySlider
        universities={universities}
        destinationId={destination?.id}
      />
      <PopularCourses countrySlug={countrySlug || undefined} destinationSlug={trimmedSlug} />
      <ScholarshipSlider
        scholarships={scholarships}
        title={`Scholarships to Study in ${countryName}`}
      />
      <EssentialStudySection
        countryName={countryName}
        countryCode={countrySlug || undefined}
        destinationSlug={trimmedSlug}
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
