"use client";

import Image from "next/image";
import { SlideContent } from "./hero-slider-client";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSlideProps {
  slide: SlideContent & {
    learnMoreText?: string;
    learnMoreUrl?: string;
  };
  isActive: boolean;
}

export function HeroSlide({ slide, isActive }: HeroSlideProps) {
  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Background with Parallax/Zoom Effect */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 transition-transform duration-8000 ease-in-out ${
            isActive ? "scale-110" : "scale-100"
          }`}
        >
          {slide.background.type === "video" ? (
            <video
              src={slide.background.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              fill
              priority
              src={slide.background.src || "/placeholder.svg"}
              alt={slide.background.alt || "Slide background"}
              className="object-cover"
            />
          )}
        </div>
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center px-4 sm:px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="max-w-3xl w-full">
          <div
            className={`flex flex-col gap-3 sm:gap-4 md:gap-6 transition-all duration-1000 delay-300 ${
              isActive
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Tagline - Mobile optimized */}
            {slide.tagline && (
              <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium uppercase tracking-wider mb-2">
                {slide.tagline}
              </p>
            )}

            {/* Headline - Mobile first responsive */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight text-balance drop-shadow-lg">
              {slide.headline.split(" ").map((word: string, idx: number) => (
                <span key={idx}>
                  {word === "UK" ||
                  word === "University" ||
                  word === "Global" ? (
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-primary-foreground">
                      {word}
                    </span>
                  ) : (
                    word
                  )}{" "}
                </span>
              ))}
            </h1>

            {/* Stats Grid - Stack on mobile, grid on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-8 py-4 sm:py-6 my-2 border-y border-white/10 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6">
              {slide.stats.map(
                (stat: { number: string; label: string }, idx: number) => (
                  <div key={idx} className="flex flex-col sm:items-center text-center relative group/stat">
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-accent mb-1">
                      {stat.number}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wider">
                      {stat.label}
                    </span>
                    {/* Decorative line - only on desktop */}
                    <div className="absolute -left-4 top-2 bottom-2 w-px bg-white/10 hidden md:block first:hidden" />
                  </div>
                )
              )}
            </div>

            {/* CTA Buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-2">
              <a
                href={slide.cta.href}
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3 bg-primary text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] touch-manipulation min-h-[44px]"
              >
                <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-sm sm:text-base">{slide.cta.text}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              {slide.learnMoreText && slide.learnMoreUrl && (
                <a
                  href={slide.learnMoreUrl}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 touch-manipulation min-h-[44px] text-sm sm:text-base"
                >
                  {slide.learnMoreText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
