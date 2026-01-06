import { prisma } from "@/lib/prisma";
import { CoursesHero } from "./components/courses-hero";
import { CourseListing } from "./components/course-listing";
import { ReviewSection } from "@/components/sections/review-section";
import { FaqSection } from "@/components/sections/faq-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import { resolveCountryContext } from "@/lib/country-resolver";

import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { fetchFaqsForCoursesPage } from "@/lib/faqs";
import { Prisma } from "../../../../prisma/src/generated/prisma/client";

export const metadata = {
  title: "Courses - NWC Education",
  description:
    "Explore world-class courses at top universities. Find your perfect program.",
};

export const dynamic = "force-dynamic";

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
    isActive: true,
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
