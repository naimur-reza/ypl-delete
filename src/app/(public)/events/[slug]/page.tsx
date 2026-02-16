import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
 

export const revalidate = 3600;

// Components

import { FaqSection } from "@/components/sections/faq-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import { fetchFaqsByContext } from "@/lib/faqs";
import { EventDetailsHero } from "@/app/[country]/(public)/events/components/event-details-hero";
import { EventRegistrationFormEnhanced } from "@/app/[country]/(public)/events/components/event-registration-form-enhanced";
import { RelatedEventsSection } from "@/app/[country]/(public)/events/components/related-events-section";
import type { Prisma } from "../../../../../prisma/src/generated/prisma/client";

interface PageProps {
  params: Promise<{
    country?: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const event = await prisma.event.findFirst({
    where: { slug, status: "ACTIVE" },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
    },
  });

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: event.metaTitle || `${event.title} - NWC Education Events`,
    description:
      event.metaDescription ||
      `Join us for ${event.title}. Register now for free counselling and expert guidance.`,
    keywords:
      event.metaKeywords ||
      `${event.title}, education event, study abroad fair, university event`,
  };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { country: countrySlug, slug } = await params;

  // Fetch the main event with all details
  const event = await prisma.event.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      destination: true,
      university: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  // Country filter: when on a country route (e.g. Bangladesh), show only events
  // for that country OR global events—not all countries.
  let countryFilter: Prisma.EventWhereInput = {};
  if (countrySlug) {
    countryFilter = {
      OR: [
        { countries: { some: { country: { slug: countrySlug } } } },
        { isGlobal: true },
      ],
    };
  }

  // Fetch related events: same destination or event type, in current country (or global), excluding current
  const relatedEvents = await prisma.event.findMany({
    where: {
      AND: [
        { id: { not: event.id } },
        { status: "ACTIVE" },
        { startDate: { gte: new Date() } }, // Only upcoming events
        {
          OR: [
            ...(event.destinationId ? [{ destinationId: event.destinationId }] : []),
            { eventType: event.eventType },
          ],
        },
        ...(Object.keys(countryFilter).length > 0 ? [countryFilter] : []),
      ],
    },
    orderBy: { startDate: "asc" },
    take: 3,
  });

  // Fetch FAQs related to the event (with destination fallback)
  const faqs = await fetchFaqsByContext(
    {
      eventId: event.id,
      destinationId: event.destinationId || undefined,
    },
    6
  );

  return (
    <main className="bg-white min-h-screen">
      {/* 1. Hero Section with Add to Calendar & Share */}
      <EventDetailsHero event={event} />

      {/* 2. Event Registration Form (Enhanced - Two Column Layout) */}
      <EventRegistrationFormEnhanced event={event} />

      {/* 3. Related Events Section */}
      <RelatedEventsSection events={relatedEvents} countrySlug={countrySlug ?? undefined} />

      {/* 4. FAQ Section */}
      <FaqSection faqs={faqs} title="Frequently Asked Questions" />

      {/* 5. Book Free Counselling CTA */}
      <CallToActionBanner />
    </main>
  );
}
