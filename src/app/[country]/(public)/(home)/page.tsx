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

type PageProps = {
  params?: Promise<{ country?: string }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const resolvedParams = (await params) ?? { country: null };
  const resolvedCountry = await resolveCountryContext(resolvedParams.country);

  const country = resolvedCountry.slug
    ? await prisma.country.findUnique({
        where: { slug: resolvedCountry.slug },
        select: {
          name: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
          metaKeywords: true,
        },
      })
    : null;

  const title =
    country?.metaTitle ||
    (country ? `${country.name} | NWC Education` : "NWC Education");

  return buildMetadata({
    title,
    description:
      country?.metaDescription ||
      "Discover top universities, courses, events, and scholarships worldwide with NWC Education.",
    keywords: country?.metaKeywords || undefined,
    url: country ? `/${country.slug}` : "/",
  });
};

const HomePage = async ({ params }: PageProps) => {
  const resolvedParams = (await params) ?? { country: null };
  const resolvedCountry = await resolveCountryContext(resolvedParams.country);
  const countrySlug = resolvedCountry.slug;

  const [
    universities,
    events,
    blogs,
    faqs,
    videos,
    accreditations,
    countries,
    destinations,
  ] = await Promise.all([
    prisma.university.findMany({
      where: {
        status: "ACTIVE",
        isFeatured: true,
        ...(countrySlug && {
          countries: {
            some: {
              country: {
                slug: countrySlug,
              },
            },
          },
        }),
      },
      take: 12,
      orderBy: { updatedAt: "desc" },
    }),
    // Country home page: show only featured upcoming events
    fetchUpcomingEvents({ countrySlug, featuredOnly: true }),
    fetchLatestBlogs(countrySlug ?? undefined, 4),
    fetchFaqsForHomePage(countrySlug, 6),
    fetchRepresentativeVideos(countrySlug),
    prisma.accreditation.findMany({
      where: {
        status: "ACTIVE",
        type: "NEWS",
        ...(countrySlug && {
          OR: [
            {
              countries: {
                some: {
                  country: {
                    slug: countrySlug,
                  },
                },
              },
            },
            { isGlobal: true },
          ],
        }),
      },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        logo: true,
        website: true,
      },
    }),
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
      where: {
        countries: {
          some: {
            country: {
              slug: countrySlug || "",
            },
          },
        },
      },
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
      <HeroSlider countrySlug={countrySlug} />
      <UniversityFilterWithWizard
        countries={countries}
        destinations={destinations}
      />
      <AboutSection countryId={countrySlug} />
      <IntakeFeature countrySlug={countrySlug} />
      <CountriesSection destination={destinations} />
      <UniversitySlider universities={universities} />
      <WhyChooseUs countrySlug={countrySlug} />
      <ReviewSection countrySlug={countrySlug} />
      <AccredianSection accreditations={accreditations} />
      <EventsSection events={events} />
      <FaqSection faqs={faqs} />
      <BlogSection blogs={blogs} />
      <RepresentativeVideoSlider videos={videos} />
      <CallToActionBanner />
    </div>
  );
};

export default HomePage;
