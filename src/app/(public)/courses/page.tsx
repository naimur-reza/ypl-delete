import { prisma } from "@/lib/prisma";

import { ReviewSection } from "@/components/sections/review-section";
import { FaqSection } from "@/components/sections/faq-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import { resolveCountryContext } from "@/lib/country-resolver";

import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { fetchFaqsForCoursesPage } from "@/lib/faqs";
import { Prisma } from "../../../../prisma/src/generated/prisma/client";
import { CoursesHero } from "@/app/[country]/(public)/courses/components/courses-hero";
import { CourseListing } from "@/app/[country]/(public)/courses/components/course-listing";

// Force static generation with ISR - revalidate every hour
export const dynamic = "force-static";
export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: "Courses | NWC Education",
    description:
      "Explore world-class courses at top universities. Find your perfect program with NWC Education.",
    url: "/courses",
  });

const CoursesPage = async ({
  params,
}: {
  params?: Promise<{ country?: string }>;
}) => {
  const resolvedParams = (await params) ?? { country: null };
  const resolvedCountry = await resolveCountryContext(resolvedParams.country);

  const where: Prisma.CourseWhereInput = {
    status: "ACTIVE",
    ...(resolvedCountry.slug
      ? {
          countries: {
            some: {
              country: { slug: resolvedCountry.slug },
            },
          },
        }
      : {}),
  };

  const courses = await prisma.course.findMany({
    where,
    include: {
      university: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
      destination: true,
      intakes: {
        select: {
          intake: true,
        },
      },
    },
    orderBy: { title: "asc" },
    take: 50,
  });

  // Fetch FAQs for courses listing page
  const faqs = await fetchFaqsForCoursesPage(resolvedCountry.slug, 6);

  return (
    <main className="bg-white">
      <CoursesHero />
      <CourseListing courses={courses} />
      <ReviewSection />
      <FaqSection faqs={faqs} />
      <CallToActionBanner />
    </main>
  );
};

export default CoursesPage;
