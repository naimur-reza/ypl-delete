import { prisma } from "@/lib/prisma";
import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import { ReviewSection } from "@/components/sections/review-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import ScholarshipHero from "./components/scholarship-hero";
import FeaturedScholarshipSlider from "./components/featured-scholarship-slider";
import ScholarshipList from "./components/scholarship-list";
import HowToApplySteps from "./components/how-to-apply-steps";
import { resolveCountryContext } from "@/lib/country-resolver";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { fetchFaqsForScholarshipsPage } from "@/lib/faqs";

type PageProps = {
  params?: Promise<{ country?: string }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const resolvedParams = (await params) ?? { country: null };
  const country = resolvedParams.country;
  return buildMetadata({
    title: country
      ? `Scholarships in ${country.toUpperCase()} | NWC Education`
      : "Scholarships | NWC Education",
    description:
      "Find scholarships by destination and university. Explore funding options for your study abroad journey.",
    url: country ? `/${country}/scholarships` : "/scholarships",
  });
};

export default async function ScholarshipPage({ params }: PageProps) {
  const resolvedParams = (await params) ?? { country: null };
  const resolvedCountry = await resolveCountryContext(resolvedParams.country);

  const scholarshipsData = await prisma.scholarship.findMany({
    where: resolvedCountry.slug
      ? {
          countries: {
            some: {
              country: { slug: resolvedCountry.slug },
            },
          },
        }
      : {},
    include: {
      destination: {
        select: {
          id: true,
          name: true,
        },
      },
      university: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Date objects to strings for client component
  const scholarships = scholarshipsData.map((scholarship) => ({
    ...scholarship,
    deadline: scholarship.deadline?.toISOString() || null,
  }));

  // Fetch FAQs for scholarships listing page
  const faqs = await fetchFaqsForScholarshipsPage(resolvedCountry.slug, 6);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <ScholarshipHero />

      {/* Featured Scholarships Slider */}
      <FeaturedScholarshipSlider scholarships={scholarships} />

      {/* List of All Scholarships with Filter */}
      <ScholarshipList scholarships={scholarships} />

      {/* How to Apply Steps */}
      <HowToApplySteps />

      {/* Student & Google Reviews */}
      <ReviewSection />

      {/* FAQs */}
      <FaqSection faqs={faqs} />

      {/* Representative Video Slider */}
      <RepresentativeVideoSlider />

      {/* CTA Section */}
      <CallToActionBanner />
    </div>
  );
}
