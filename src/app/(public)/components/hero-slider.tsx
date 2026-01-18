import { prisma } from "@/lib/prisma";
import { HeroSliderClient, SlideContent } from "./hero-slider-client";

// Default slides with stats as fallback
const defaultSlides: SlideContent[] = [
  {
    id: "1",
    tagline: "100% Free Counselling & Application Processing.",
    headline: "One of the largest UK Universities' representative",
    stats: [
      { number: "20,000+", label: "Student's Career" },
      { number: "35+", label: "Recruitment Awards" },
      { number: "140+", label: "University Partners" },
    ],
    cta: { text: "Apply Now", href: "#apply" },
    learnMoreText: "Learn More",
    learnMoreUrl: "#learn-more-1",
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
    learnMoreText: "Learn More",
    learnMoreUrl: "#learn-more-2",
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
    learnMoreText: "Learn More",
    learnMoreUrl: "#learn-more-3",
    background: {
      type: "image",
      src: "/hero/diverse-students-from-different-countries.jpg.png",
      alt: "Global students",
    },
  },
];

interface HeroSliderProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export async function HeroSlider({
  autoPlay = true,
  autoPlayInterval = 5000,
}: HeroSliderProps) {
  // Fetch dynamic hero stats from database
  const heroStats = await prisma.stat.findMany({
    where: {
      section: "hero",
      status: "ACTIVE",
    },
    orderBy: [{ slideIndex: "asc" }, { sortOrder: "asc" }],
  });

  // Group stats by slideIndex
  const statsBySlide: Record<
    number,
    Array<{ title: string; subtitle: string }>
  > = {};
  heroStats.forEach((stat) => {
    const slideIdx = stat.slideIndex ?? 0;
    if (!statsBySlide[slideIdx]) {
      statsBySlide[slideIdx] = [];
    }
    statsBySlide[slideIdx].push({
      title: stat.title,
      subtitle: stat.subtitle,
    });
  });

  // Merge dynamic stats into slides
  const slides = defaultSlides.map((slide, idx) => {
    const dynamicStats = statsBySlide[idx];
    if (dynamicStats && dynamicStats.length > 0) {
      return {
        ...slide,
        stats: dynamicStats.map((s) => ({
          number: s.title,
          label: s.subtitle,
        })),
      };
    }
    return slide;
  });

  return (
    <HeroSliderClient
      slides={slides}
      autoPlay={autoPlay}
      autoPlayInterval={autoPlayInterval}
    />
  );
}
