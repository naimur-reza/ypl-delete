"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "./hero-slide";

export interface SlideContent {
  id: string;
  tagline: string;
  headline: string;
  description?: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
  cta: {
    text: string;
    href: string;
  };
  background: {
    type: "image" | "video";
    src: string;
    alt?: string;
  };
}

interface HeroSliderProps {
  slides?: SlideContent[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  countrySlug?: string | null;
}

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

export function HeroSlider({
  slides: initialSlides,
  autoPlay = true,
  autoPlayInterval = 5000,
  countrySlug,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideContent[]>(
    initialSlides || defaultSlides
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dynamic hero data and stats
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setIsLoading(true);

        // Build query params
        const params = new URLSearchParams({
          slug: "home",
          status: "ACTIVE",
        });

        // If countrySlug exists, first fetch the country ID
        let countryId: string | null = null;
        if (countrySlug) {
          const countryResponse = await fetch(
            `/api/countries?slug=${countrySlug}`
          );
          if (countryResponse.ok) {
            const countryData = await countryResponse.json();
            if (countryData.length > 0) {
              countryId = countryData[0].id;
              params.append("countryId", countryData[0].id);
            }
          }
        }

        // Fetch heroes
        const response = await fetch(`/api/heroes?${params.toString()}`);

        // Fetch hero stats
        const statsParams = new URLSearchParams({
          section: "hero",
          status: "ACTIVE",
        });
        const statsResponse = await fetch(
          `/api/stats?${statsParams.toString()}`
        );
        const statsBySlide: Record<
          number,
          Array<{ number: string; label: string }>
        > = {};

        if (statsResponse.ok) {
          const heroStats = await statsResponse.json();
          // Group stats by slideIndex
          heroStats.forEach(
            (stat: {
              title: string;
              subtitle: string;
              slideIndex?: number | null;
            }) => {
              const slideIdx = stat.slideIndex ?? 0;
              if (!statsBySlide[slideIdx]) {
                statsBySlide[slideIdx] = [];
              }
              statsBySlide[slideIdx].push({
                number: stat.title,
                label: stat.subtitle,
              });
            }
          );
        }

        if (response.ok) {
          const heroes = await response.json();

          if (heroes && heroes.length > 0) {
            // Convert heroes to SlideContent format and merge stats
            const dynamicSlides: SlideContent[] = heroes.map(
              (hero: any, index: number) => ({
                id: hero.id,
                tagline: hero.subtitle || "",
                headline: hero.title,
                description: hero.subtitle || undefined,
                stats: statsBySlide[index] || [], // Use dynamic stats if available
                cta: {
                  text: hero.buttonText || "Learn More",
                  href: hero.buttonUrl || "#",
                },
                background: {
                  type:
                    hero.backgroundType === "YOUTUBE"
                      ? "video"
                      : (hero.backgroundType.toLowerCase() as
                          | "image"
                          | "video"),
                  src: hero.backgroundUrl,
                  alt: hero.title,
                },
              })
            );

            setSlides(dynamicSlides);
          } else {
            // Use default slides with fetched stats if available
            const slidesWithStats = (initialSlides || defaultSlides).map(
              (slide, idx) => {
                if (statsBySlide[idx] && statsBySlide[idx].length > 0) {
                  return { ...slide, stats: statsBySlide[idx] };
                }
                return slide;
              }
            );
            setSlides(slidesWithStats);
          }
        } else {
          // Use default slides on error
          setSlides(initialSlides || defaultSlides);
        }
      } catch (error) {
        console.error("Error fetching heroes:", error);
        // Use default slides on error
        setSlides(initialSlides || defaultSlides);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroes();
  }, [countrySlug, initialSlides]);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[600px] md:h-[800px] overflow-hidden bg-background group">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <HeroSlide slide={slide} isActive={index === currentSlide} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only visible on hover for desktop, always for mobile */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 translate-x-[20px] group-hover:translate-x-0"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Dot Navigation with Progress Indicator style */}
      {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-12 bg-accent"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <span className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
            )}
          </button>
        ))}
      </div> */}
    </div>
  );
}
