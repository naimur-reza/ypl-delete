"use client";

import { DynamicHero } from "@/components/hero/DynamicHero";

interface UniversitiesHeroProps {
  countrySlug?: string | null;
}

export function UniversitiesHero({ countrySlug }: UniversitiesHeroProps) {
  return (
    <DynamicHero
      slug="universities"
      countrySlug={countrySlug}
      defaultTitle="Find Your Dream University"
      defaultSubtitle="Browse through our extensive list of top-ranked universities from around the world. Filter by country, course, and more to find the perfect match for your academic goals."
      defaultButtonText="Explore Universities"
      defaultButtonUrl="#"
      defaultBackgroundUrl="https://www.ncuk.ac.uk/wp-content/uploads/2018/05/The-University-of-Western-Australia-Website-Header-Mobile-2023.jpg"
    />
  );
}
