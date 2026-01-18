import { prisma } from "@/lib/prisma";
import { HeroSliderClient, SlideContent } from "./hero-slider-client";

// Re-export for convenience
export type { SlideContent } from "./hero-slider-client";

// Default slides with stats as fallback
const defaultSlides: SlideContent[] = [
  {
    id: "1",
    tagline: "100% Free Counselling & Application Processing.",
    headline: "One of the largest UK Universities representative",
    stats: [
      { number: "20,000+", label: "Student's Career" },
      { number: "35+", label: "Recruitment Awards" },
      { number: "140+", label: "University Partners" },
    ],
    cta: { text: "Apply Now", href: "#apply" },
    background: {
      type: "image",
      src: "/hero/student-with-glasses-studying.png",
      alt: "Student studying",
    },
  },
  {
    id: "2",
    tagline: "Expert Guidance for Your Future.",
    headline: "Personalized University Counselling Services",
    stats: [
      { number: "500+", label: "Universities Covered" },
      { number: "98%", label: "Success Rate" },
      { number: "15+", label: "Years Experience" },
    ],
    cta: { text: "Get Counselling", href: "#counselling" },
    background: {
      type: "image",
      src: "/hero/professional-counselor-with-student.jpg",
      alt: "Counselling session",
    },
  },
  {
    id: "3",
    tagline: "Global Opportunities Await.",
    headline: "Study Abroad with Complete Support",
    stats: [
      { number: "50+", label: "Countries" },
      { number: "10,000+", label: "Placements" },
      { number: "24/7", label: "Support" },
    ],
    cta: { text: "Explore Programs", href: "#programs" },
    background: {
      type: "image",
      src: "/hero/diverse-students-from-different-countries.jpg.png",
      alt: "Global students",
    },
  },
];

interface HeroSliderProps {
  countrySlug?: string | null;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  videoSlideInterval?: number;
}

/**
 * Server component that fetches hero data from database and renders client slider
 * This ensures the hero data is cached at build time (SSG) with ISR support
 */
export async function HeroSlider({
  countrySlug,
  autoPlay = true,
  autoPlayInterval = 5000,
  videoSlideInterval = 15000,
}: HeroSliderProps) {
  // Build where clause for heroes
  const heroWhereClause: {
    slug: string;
    status: "ACTIVE" | "DRAFT";
    countries?: { some: { country: { slug: string } } };
  } = {
    slug: "home",
    status: "ACTIVE",
  };

  // If countrySlug is provided, filter by country
  if (countrySlug) {
    heroWhereClause.countries = {
      some: {
        country: {
          slug: countrySlug,
        },
      },
    };
  }

  // Fetch heroes and stats in parallel
  const [heroes, heroStats] = await Promise.all([
    prisma.hero.findMany({
      where: heroWhereClause,
      orderBy: { order: "asc" },
      include: {
        countries: {
          include: {
            country: {
              select: { slug: true, name: true },
            },
          },
        },
      },
    }),
    prisma.stat.findMany({
      where: {
        section: "hero",
        status: "ACTIVE",
      },
      orderBy: [{ slideIndex: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  // Group stats by slideIndex
  const statsBySlide: Record<
    number,
    Array<{ number: string; label: string }>
  > = {};
  heroStats.forEach((stat) => {
    const slideIdx = stat.slideIndex ?? 0;
    if (!statsBySlide[slideIdx]) {
      statsBySlide[slideIdx] = [];
    }
    statsBySlide[slideIdx].push({
      number: stat.title,
      label: stat.subtitle,
    });
  });

  let slides: SlideContent[];

  if (heroes.length > 0) {
    // Convert database heroes to SlideContent format
    slides = heroes.map((hero, index) => ({
      id: hero.id,
      tagline: hero.subtitle || undefined,
      headline: hero.title,
      description: hero.subtitle || undefined,
      stats: statsBySlide[index] || [],
      learnMoreText: hero.learnMoreText || undefined,
      learnMoreUrl: hero.learnMoreUrl || undefined,
      cta: {
        text: hero.buttonText || "Learn More",
        href: hero.buttonUrl || "#",
      },
      background: {
        type: hero.backgroundType.toLowerCase() as
          | "image"
          | "video"
          | "youtube",
        src: hero.backgroundUrl,
        alt: hero.title,
      },
    }));
  } else {
    // Use default slides with fetched stats if available
    slides = defaultSlides.map((slide, idx) => {
      if (statsBySlide[idx] && statsBySlide[idx].length > 0) {
        return { ...slide, stats: statsBySlide[idx] };
      }
      return slide;
    });
  }

  return (
    <HeroSliderClient
      slides={slides}
      autoPlay={autoPlay}
      autoPlayInterval={autoPlayInterval}
      videoSlideInterval={videoSlideInterval}
    />
  );
}
