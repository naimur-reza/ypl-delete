"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "./hero-slide";

export interface SlideContent {
  id: string;
  tagline: string;
  headline: string;
  description?: string;
  learnMoreText?: string;
  learnMoreUrl?: string;
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

interface HeroSliderClientProps {
  slides: SlideContent[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function HeroSliderClient({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
}: HeroSliderClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

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
