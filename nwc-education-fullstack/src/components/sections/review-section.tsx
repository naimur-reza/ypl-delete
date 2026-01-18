import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Star } from "lucide-react";
import { ReviewSlider } from "./review-slider";
import { resolveCountryContext } from "@/lib/country-resolver";

type ReviewSectionProps = {
  universityId?: string;
  countryId?: string;
  countrySlug?: string | null;
};

// Build country filter for Testimonial model (uses join table TestimonialCountry)
const buildCountryWhere = (countryId?: string, countrySlug?: string | null) => {
  if (!countryId && !countrySlug) return {};

  const conditions = [];
  
  if (countryId) {
    conditions.push({
      countries: {
        some: {
          countryId: countryId,
        },
      },
    });
  }
  
  if (countrySlug) {
    conditions.push({
      countries: {
        some: {
          country: { slug: countrySlug },
        },
      },
    });
  }

  return conditions.length > 0 ? { OR: conditions } : {};
};

export async function ReviewSection({
  universityId,
  countryId,
  countrySlug,
}: ReviewSectionProps = {}) {
  const resolvedCountry =
    !countrySlug && !countryId ? await resolveCountryContext() : null;
  const effectiveSlug = countrySlug ?? resolvedCountry?.slug ?? null;
  const countryWhere = buildCountryWhere(countryId, effectiveSlug);

  const studentReviews = await prisma.testimonial.findMany({
    where: {
      type: "STUDENT",
      ...(countryWhere.OR ? { OR: countryWhere.OR } : {}),
      ...(universityId ? { universities: { some: { universityId } } } : {}),
    },
    take: 6,
    orderBy: { order: "asc" },
  });

  // Fetch GMB Reviews (might not be directly linked to uni/country in schema, but assuming they might be or we fallback to general)
  // If filtered by uni/country and no GMB reviews found, we might want to show general ones or hide section.
  // For now, let's try to filter, and if empty, maybe show general if it's the main page?
  // The prompt implies "related this University and Country", so we should try to filter.

  const gmbReviews = await prisma.testimonial.findMany({
    where: {
      type: "GMB",
      ...(countryWhere.OR ? { OR: countryWhere.OR } : {}),
    },
    take: 6,
    orderBy: { rating: "desc" },
  });

  // Fallback data if no reviews found (only use if NO filters are applied, or maybe always for demo purposes if DB is empty?)
  // If filters are applied and no data, it's better to show nothing or a "No reviews yet" message,
  // but for this demo/dev phase, I'll keep the fallbacks if it's a general page, or maybe just empty arrays.
  // Let's use fallbacks ONLY if no filters are provided (Home/Study Abroad pages).

  const useFallbacks = !universityId && !countryId;

  const displayStudentReviews =
    studentReviews.length > 0
      ? studentReviews
      : useFallbacks
      ? [
          {
            id: "1",
            name: "Sarah Johnson",
            message:
              "Studying in the UK changed my life. The support I received was incredible!",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
            videoId: "dQw4w9WgXcQ", // has video
          },
          {
            id: "2",
            name: "Michael Chen",
            message:
              "Thanks to the guidance, I got into my dream university in Canada with a scholarship!",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
            // ❌ no video → play button hidden
          },
          {
            id: "3",
            name: "Emily Davis",
            message:
              "The process was smooth and transparent. Highly recommended!",
            image:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
            videoId: "9bZkp7q19f0", // has video
          },
          {
            id: "4",
            name: "Rahul Sharma",
            message:
              "They helped me prepare for my visa interview and guided me in every step of the journey.",
            image:
              "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop",
            // ❌ no video
          },
          {
            id: "5",
            name: "Aisha Ahmed",
            message:
              "Got admission to a top Australian university — thank you for the smooth experience!",
            image:
              "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop",
            videoId: "3JZ_D3ELwOQ", // has video
          },
        ]
      : [];

  const displayGmbReviews =
    gmbReviews.length > 0
      ? gmbReviews
      : useFallbacks
      ? [
          {
            id: "1",
            name: "John Doe",
            message: "Excellent service! They helped me every step of the way.",
            rating: 5,
            publishedAt: new Date(),
          },
          {
            id: "2",
            name: "Jane Smith",
            message: "Very professional and knowledgeable team.",
            rating: 5,
            publishedAt: new Date(),
          },
          {
            id: "3",
            name: "Robert Wilson",
            message: "Great experience, highly recommended.",
            rating: 5,
            publishedAt: new Date(),
          },
        ]
      : [];

  if (displayStudentReviews.length === 0 && displayGmbReviews.length === 0) {
    return null; // Don't render section if no content
  }

  return (
    <section className="py-5 bg-slate-950 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="container mx-auto  relative z-10">
        {/* Student Reviews (Video Style) */}
        {displayStudentReviews.length > 0 && (
          <ReviewSlider
            title="Student Success Stories"
            description="Hear directly from our students about their life-changing journeys and experiences studying abroad."
            items={displayStudentReviews}
            type="video"
          />
        )}

        {/* GMB Reviews */}
        {displayGmbReviews.length > 0 && (
          <div className=" ">
            <ReviewSlider
              title="Google Reviews"
              items={displayGmbReviews}
              type="text"
              icon={
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 w-fit">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    width={20}
                    height={20}
                    alt="Google"
                  />
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star fill="currentColor" className="w-3 h-3" />
                    <Star fill="currentColor" className="w-3 h-3" />
                    <Star fill="currentColor" className="w-3 h-3" />
                    <Star fill="currentColor" className="w-3 h-3" />
                    <Star fill="currentColor" className="w-3 h-3" />
                  </div>
                  <span className="text-white text-xs font-medium">
                    4.9/5.0
                  </span>
                </div>
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}
