"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide, SlideContent } from "./hero-slide";

// Re-export SlideContent for convenience
export type { SlideContent } from "./hero-slide";

interface HeroSliderClientProps {
  slides: SlideContent[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  videoSlideInterval?: number;
}

export function HeroSliderClient({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  videoSlideInterval = 15000, // 15 seconds for video slides
}: HeroSliderClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Determine if current slide is a video type
  const isCurrentSlideVideo = useCallback(() => {
    const currentBackground = slides[currentSlide]?.background;
    return (
      currentBackground?.type === "video" ||
      currentBackground?.type === "youtube"
    );
  }, [slides, currentSlide]);

  // Get the appropriate interval based on slide type
  const getCurrentInterval = useCallback(() => {
    return isCurrentSlideVideo() ? videoSlideInterval : autoPlayInterval;
  }, [isCurrentSlideVideo, videoSlideInterval, autoPlayInterval]);

  // Auto-play effect with dynamic interval based on slide type
  useEffect(() => {
    if (!autoPlay || slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, getCurrentInterval());

    return () => clearInterval(interval);
  }, [autoPlay, slides.length, isPaused, currentSlide, getCurrentInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-background group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

      {/* Navigation Arrows - Only visible on hover for desktop */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 -translate-x-5 group-hover:translate-x-0"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 translate-x-5 group-hover:translate-x-0"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Dot Navigation with Progress Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-4 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-2 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "w-8 sm:w-12 bg-accent"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <span className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Video indicator */}
      {isCurrentSlideVideo() && (
        <div className="absolute top-4 right-4 z-30 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/80 text-xs font-medium">
          Video Playing
        </div>
      )}
    </div>
  );
}
