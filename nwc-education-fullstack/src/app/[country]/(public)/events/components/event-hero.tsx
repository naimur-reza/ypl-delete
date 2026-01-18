"use client";

import { DynamicHero } from "@/components/hero/DynamicHero";

interface EventHeroProps {
  countrySlug?: string | null;
}

export function EventHero({ countrySlug }: EventHeroProps) {
  return (
    <DynamicHero
      slug="events"
      countrySlug={countrySlug}
      defaultTitle="Education Fairs & Webinars"
      defaultSubtitle="Join our upcoming events to connect with top universities, get expert study abroad advice, and start your journey."
      defaultButtonText="View Events"
      defaultButtonUrl="#"
      defaultBackgroundUrl="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop"
    />
  );
}
