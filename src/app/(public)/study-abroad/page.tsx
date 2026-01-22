import { StudyAbroadHero } from "./components/hero-section";

import { StudyAbroadCountries } from "./components/countries-section";
import { PopularCourses } from "./components/popular-courses";
import { ScholarshipSlider } from "./components/scholarship-slider";

import { UniversityLogoSlider } from "./components/university-logo-slider";

import CallToActionBanner from "@/components/CallToActionBanner";

import { FaqSection } from "@/components/sections/faq-section";
import { prisma } from "@/lib/prisma";
import {
  AccredianSection,
  EventsSection,
  IntakeFeature,
} from "@/app/[country]/(public)/(home)/components";
import { UniversityFilterWithWizard } from "@/components/filters/university-filter-with-wizard";
import { ReviewSection } from "@/components/sections/review-section";
import { fetchFaqsForHomePage, fetchFaqsForScholarshipsPage } from "@/lib/faqs";

export const metadata = {
  title: "Study Abroad - NWC Education",
  description:
    "Explore study abroad opportunities with NWC Education. Find universities, scholarships, and get expert guidance.",
};

// Enable ISR with 1 hour revalidation for SSG
export const revalidate = 3600;

type StudyAbroadPageProps = {
  params: Promise<{
    country: string;
  }>;
};
const StudyAbroadPage = async ({ params }: StudyAbroadPageProps) => {
  const { country } = await params;

  // Fetch all data in parallel for better performance
  const [events, partners, countries, faqs, destinations, scholarships] = await Promise.all([
    // Fetch upcoming events (limit to 6)
    prisma.event.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: 6,
    }),

    // Fetch university partners (limit to 12 for display)
    prisma.accreditation.findMany({
      where: {
        type: "PARTNER",
        status: "ACTIVE",
      },
      orderBy: {
        sortOrder: "asc",
      },
      take: 12,
    }),

    // Fetch countries
    prisma.country.findMany({}),

    // Fetch FAQs
    fetchFaqsForHomePage(country, 6),

    // Fetch destinations for this country
    prisma.destination.findMany({
      where: {
        countries: {
          some: {
            country: {
              slug: country,
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),

    // Fetch scholarships for the slider (limit to 10)
    prisma.scholarship.findMany({
      where: {
        status: "ACTIVE",
        countries: {
          some: {
            country: {
              slug: country,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

  return (
    <main className="bg-white">
      {/* 1. Hero Section */}
      <StudyAbroadHero />

      {/* 2. Filter Section */}
      <UniversityFilterWithWizard
        countries={countries}
        destinations={destinations}
      />

      {/* 3. Country Section */}
      <StudyAbroadCountries countrySlug={country} />

      {/* 4. Popular Courses - Dynamic */}
      <PopularCourses />

      {/* 5. University Partners */}
      {/* <AccredianSection
        accreditations={partners}
        title="Our University"
        highlightedWord="Partners"
      /> */}

      {/* 6. Intake Features */}
      <IntakeFeature countrySlug={country} />

      {/* 7. Scholarship Slider - Dynamic */}
      <ScholarshipSlider
        scholarships={scholarships}
        title="How to choose the courses perfect for your goals"
      />

      {/* 8. All Universities Logo Slider */}
      <UniversityLogoSlider />

      {/* 9. Student Review Video Slider + Google My Business Review Slider */}
      <ReviewSection countrySlug={country} />

      {/* 10. Upcoming Event */}
      <EventsSection events={events as any} />

      {/* 11. FAQs */}
      <FaqSection faqs={faqs} />

      {/* 12. Book free counselling CTR Section */}
      <CallToActionBanner />
    </main>
  );
};

export default StudyAbroadPage;
