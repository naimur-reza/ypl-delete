"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonUrl?: string;
  learnMoreText?: string;
  learnMoreUrl?: string;
  backgroundType: "IMAGE" | "VIDEO" | "YOUTUBE";
  backgroundUrl: string;
}

interface DynamicHeroProps {
  slug: string;
  countrySlug?: string | null;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultButtonText?: string;
  defaultButtonUrl?: string;
  defaultBackgroundUrl: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function DynamicHero({
  slug,
  countrySlug,
  defaultTitle,
  defaultSubtitle,
  defaultButtonText,
  defaultButtonUrl,
  defaultBackgroundUrl,
  autoPlay = true,
  autoPlayInterval = 5000,
}: DynamicHeroProps) {
  const [heroes, setHeroes] = useState<HeroData[]>([
    {
      id: "default",
      title: defaultTitle,
      subtitle: defaultSubtitle,
      buttonText: defaultButtonText,
      buttonUrl: defaultButtonUrl,
      backgroundType: "IMAGE",
      backgroundUrl: defaultBackgroundUrl,
    },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          slug,
          status: "ACTIVE",
        });

        // If countrySlug exists, first fetch the country ID
        if (countrySlug) {
          const countryResponse = await fetch(
            `/api/countries?slug=${countrySlug}`,
          );
          if (countryResponse.ok) {
            const countryData = await countryResponse.json();
            if (countryData.length > 0) {
              params.append("countryId", countryData[0].id);
            }
          }
        }

        const response = await fetch(`/api/heroes?${params.toString()}`);

        if (response.ok) {
          const fetchedHeroes = await response.json();

          if (fetchedHeroes && fetchedHeroes.length > 0) {
            const mappedHeroes: HeroData[] = fetchedHeroes.map((hero: any) => ({
              id: hero.id,
              title: hero.title,
              subtitle: hero.subtitle || defaultSubtitle,
              buttonText: hero.buttonText || defaultButtonText,
              buttonUrl: hero.buttonUrl || defaultButtonUrl,
              learnMoreText: hero.learnMoreText,
              learnMoreUrl: hero.learnMoreUrl,
              backgroundType: hero.backgroundType,
              backgroundUrl: hero.backgroundUrl,
            }));
            setHeroes(mappedHeroes);
          }
        }
      } catch (error) {
        console.error("Error fetching heroes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroes();
  }, [
    slug,
    countrySlug,
    defaultTitle,
    defaultSubtitle,
    defaultButtonText,
    defaultButtonUrl,
    defaultBackgroundUrl,
  ]);

  // Auto-play for slider (only when multiple heroes)
  useEffect(() => {
    if (!autoPlay || heroes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroes.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, heroes.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroes.length) % heroes.length);
  };

  const renderBackground = (hero: HeroData) => {
    const isYouTube =
      hero.backgroundType === "YOUTUBE" ||
      hero.backgroundUrl.includes("youtube.com") ||
      hero.backgroundUrl.includes("youtu.be");

    if (hero.backgroundType === "VIDEO" || isYouTube) {
      if (isYouTube) {
        // Convert YouTube watch URL to embed URL if needed
        let embedUrl = hero.backgroundUrl;
        if (embedUrl.includes("watch?v=")) {
          embedUrl = embedUrl.replace("watch?v=", "embed/");
        }
        if (embedUrl.includes("youtu.be/")) {
          embedUrl = embedUrl.replace("youtu.be/", "www.youtube.com/embed/");
        }
        // Add autoplay and loop params
        if (!embedUrl.includes("?")) {
          embedUrl += "?autoplay=1&mute=1&loop=1&controls=0&playlist=";
          const videoId = embedUrl.split("/embed/")[1]?.split("?")[0];
          if (videoId) embedUrl += videoId;
        }

        return (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full object-cover"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 0 }}
          />
        );
      } else {
        return (
          <video
            src={hero.backgroundUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        );
      }
    }

    return (
      <Image
        src={hero.backgroundUrl}
        alt={hero.title}
        fill
        className="object-cover"
        priority
      />
    );
  };

  const isSlider = heroes.length > 1;
  const currentHero = heroes[currentSlide];

  return (
    <section
      className={`relative ${
        isSlider ? "h-[670px] md:h-[750px]" : "h-[60vh] min-h-[500px]"
      } flex items-center justify-center overflow-hidden bg-slate-900 group`}
    >
      {/* Background Slides */}
      {isSlider ? (
        <div className="absolute inset-0 z-0">
          {heroes.map((hero, index) => (
            <div
              key={hero.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {renderBackground(hero)}
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          {renderBackground(currentHero)}
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90" />
        </div>
      )}

      {/* Content */}
      <div
        className={`relative z-10 ${
          isSlider
            ? "max-w-[1400px] px-6 sm:px-12 lg:px-20 w-full"
            : "max-w-4xl mx-auto px-4 text-center"
        }`}
      >
        <div className={isSlider ? "max-w-3xl" : ""}>
          <h1
            className={`font-bold text-white mb-6 tracking-tight ${
              isSlider
                ? "text-5xl sm:text-6xl lg:text-7xl leading-[1.1]"
                : "text-4xl md:text-6xl"
            }`}
          >
            {currentHero.title.split(" ").map((word, idx) => {
              // Highlight certain keywords
              const highlightWords = [
                "University",
                "Universities",
                "Courses",
                "Scholarships",
                "Events",
                "Study",
                "Services",
                "UK",
                "Global",
              ];
              const shouldHighlight = highlightWords.some((hw) =>
                word.includes(hw),
              );

              return (
                <span key={idx}>
                  {shouldHighlight ? (
                    <span
                      className={
                        isSlider
                          ? "text-transparent bg-clip-text bg-linear-to-r from-accent to-primary-foreground"
                          : "text-primary"
                      }
                    >
                      {word}
                    </span>
                  ) : (
                    word
                  )}{" "}
                </span>
              );
            })}
          </h1>

          <p
            className={`text-slate-200 mb-8 leading-relaxed ${
              isSlider
                ? "text-lg md:text-xl max-w-2xl"
                : "text-lg md:text-xl max-w-2xl mx-auto"
            }`}
          >
            {currentHero.subtitle}
          </p>

          {currentHero.buttonText && currentHero.buttonUrl && (
            <div
              className={
                isSlider ? "flex flex-wrap gap-4" : "flex justify-center"
              }
            >
              <Link href={currentHero.buttonUrl}>
                <GradientButton>{currentHero.buttonText}</GradientButton>
              </Link>
              {currentHero.learnMoreText && currentHero.learnMoreUrl && (
                <Link href={currentHero.learnMoreUrl}>
                  <GradientButton variant="outline">
                    {currentHero.learnMoreText}
                  </GradientButton>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Slider Navigation - Only show for multiple heroes */}
      {isSlider && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 translate-x-[20px] group-hover:translate-x-0"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
            {heroes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`relative h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? "w-8 bg-accent"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
