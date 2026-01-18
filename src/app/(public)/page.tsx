import { prisma } from "@/lib/prisma";
import {
  IntakeFeature,
  HeroSlider,
  CountriesSection,
  UniversitySlider,
  AccredianSection,
  WhyChooseUs,
  EventsSection,
  BlogSection,
} from "./components";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { ReviewSection } from "@/components/sections/review-section";
import { FaqSection } from "@/components/sections/faq-section";
import { resolveCountryContext } from "@/lib/country-resolver";
import { fetchLatestBlogs } from "@/lib/blogs";
import { fetchUpcomingEvents } from "@/lib/events";
import { fetchRepresentativeVideos } from "@/lib/representative-videos";
import { fetchFaqsForHomePage } from "@/lib/faqs";
import { UniversityFilterWithWizard } from "@/components/filters/university-filter-with-wizard";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { AboutSection } from "@/components/home/about-section";

// Enable ISR with 1 hour revalidation for SSG
export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> => {
  return buildMetadata({
    title: "NWC Education | Study Abroad & Global Admissions",
    description:
      "Discover top universities, courses, events, and scholarships worldwide with NWC Education.",
  });
};

const HomePage = async () => {
  const resolvedCountry = await resolveCountryContext();
  const countrySlug = resolvedCountry.slug;

  const [universities, events, blogs, faqs, videos, countries, destinations] =
    await Promise.all([
      prisma.university.findMany({
        where: countrySlug
          ? {
              status: "ACTIVE",
              countries: { some: { country: { slug: countrySlug } } },
            }
          : { status: "ACTIVE" },
        take: 12,
        orderBy: { updatedAt: "desc" },
      }),
      // Home page: show only featured upcoming events
      fetchUpcomingEvents({ countrySlug, featuredOnly: false }),
      fetchLatestBlogs(countrySlug ?? undefined, 4),
      fetchFaqsForHomePage(countrySlug, 6),
      fetchRepresentativeVideos(countrySlug),
      prisma.country.findMany({
        where: { status: "ACTIVE" },
        select: {
          id: true,
          name: true,
          isoCode: true,
          flag: true,
        },
        orderBy: { name: "asc" },
      }),
      prisma.destination.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

  return (
    <div>
      <HeroSlider />
      <UniversityFilterWithWizard
        countries={countries}
        destinations={destinations}
      />
      <AboutSection />
      <IntakeFeature />
      <CountriesSection />
      <UniversitySlider universities={universities} />
      <WhyChooseUs countrySlug={countrySlug} />
      <ReviewSection countrySlug={countrySlug} />
      <AccredianSection />
      <EventsSection events={events} />
      <FaqSection faqs={faqs} />
      <BlogSection blogs={blogs} />
      <RepresentativeVideoSlider videos={videos} />
      <CallToActionBanner />
    </div>
  );
};

export default HomePage;
