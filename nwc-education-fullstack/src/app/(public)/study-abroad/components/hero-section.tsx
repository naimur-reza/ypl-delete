"use client";

import { DynamicHero } from "@/components/hero/DynamicHero";
import Link from "next/link";

interface StudyAbroadHeroProps {
  countrySlug?: string | null;
}

export function StudyAbroadHero({ countrySlug }: StudyAbroadHeroProps) {
  const applyNowUrl = "/apply-now";

  return (
    <DynamicHero
      slug="study-abroad"
      countrySlug={countrySlug}
      defaultTitle="Discover Your Future Without Borders"
      defaultSubtitle="Explore top-ranked universities, scholarships, and vibrant cultures across the globe. Your journey to world-class education starts here."
      defaultButtonText="Get Started"
      defaultButtonUrl={applyNowUrl}
      defaultBackgroundUrl="https://www.ncuk.ac.uk/wp-content/uploads/2018/05/The-University-of-Western-Australia-Website-Header-Mobile-2023.jpg"
    />
  );
}
