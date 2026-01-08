import { EventHero } from "@/app/[country]/(public)/events/components/event-hero";
import { EventListing } from "@/app/[country]/(public)/events/components/event-listing";
import { WhyAttendSection } from "@/app/[country]/(public)/events/components/why-attend-section";
import { PastEventsSection } from "@/app/[country]/(public)/events/components/past-events-section";
import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { resolveCountryContext } from "@/lib/country-resolver";
import { fetchPastEvents, fetchUpcomingEvents } from "@/lib/events";
import { fetchRepresentativeVideos } from "@/lib/representative-videos";
import { fetchFaqsForEventsPage } from "@/lib/faqs";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

// Events are time-sensitive, use shorter revalidation (5 minutes)
export const revalidate = 300;

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: "Events | NWC Education",
    description:
      "Join our education fairs, webinars, and university events. Connect with top institutions worldwide.",
    url: "/events",
  });

type PageProps = {
  params?: Promise<{ country?: string }>;
};

const EventsPage = async ({ params }: PageProps) => {
  const resolvedParams = (await params) ?? { country: null };
  const resolvedCountry = await resolveCountryContext(resolvedParams.country);

  const [upcomingEvents, pastEvents, videos, faqs] = await Promise.all([
    fetchUpcomingEvents({ countrySlug: resolvedCountry.slug }),
    fetchPastEvents({ countrySlug: resolvedCountry.slug }),
    fetchRepresentativeVideos(resolvedCountry.slug),
    fetchFaqsForEventsPage(resolvedCountry.slug, 6),
  ]);

  return (
    <main className="bg-white">
      {/* 1. Hero Section (Replaces Slider) */}
      <EventHero />

      {/* 2. Event Listing with Sidebar Filters */}
      <EventListing events={upcomingEvents} />

      {/* 3. Why Attend Section */}
      <WhyAttendSection />

      {/* 5. Past Event Card Box */}
      <PastEventsSection events={pastEvents} />

      {/* 6. FAQ */}
      <FaqSection faqs={faqs} />

      {/* 7. Representative Review Video Slider Testimonials */}
      <RepresentativeVideoSlider videos={videos} />

      {/* 8. Book free counselling CTR Section */}
      <CallToActionBanner />
    </main>
  );
};

export default EventsPage;
