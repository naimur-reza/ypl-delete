"use client";

import { DynamicHero } from "@/components/hero/DynamicHero";

interface CoursesHeroProps {
  countrySlug?: string | null;
}

export function CoursesHero({ countrySlug }: CoursesHeroProps) {
  return (
    <DynamicHero
      slug="courses"
      countrySlug={countrySlug}
      defaultTitle="Explore World-Class Courses"
      defaultSubtitle="Discover thousands of programs across disciplines at top universities worldwide. Find the perfect course that aligns with your career aspirations."
      defaultButtonText="Browse Courses"
      defaultButtonUrl="#"
      defaultBackgroundUrl="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
    />
  );
}
