"use client";

import { DynamicHero } from "@/components/hero/DynamicHero";

interface ScholarshipHeroProps {
  countrySlug?: string | null;
}

export default function ScholarshipHero({ countrySlug }: ScholarshipHeroProps) {
  return (
    <DynamicHero
      slug="scholarships"
      countrySlug={countrySlug}
      defaultTitle="Fund Your Study Abroad Dream with Scholarships"
      defaultSubtitle="Discover thousands of fully funded and partial scholarships from top universities worldwide. We help you find, apply, and secure the funding you need."
      defaultButtonText="Browse Scholarships"
      defaultButtonUrl="#"
      defaultBackgroundUrl="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop"
    />
  );
}
