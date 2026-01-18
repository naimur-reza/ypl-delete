"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface SlideContent {
  id: string;
  tagline?: string;
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
    type: "image" | "video" | "youtube";
    src: string;
    alt?: string;
  };
}

interface HeroSlideProps {
  slide: SlideContent;
  isActive: boolean;
}

/**
 * Converts a YouTube URL to an embeddable URL with proper parameters
 */
function getYouTubeEmbedUrl(url: string): string {
  let videoId = "";

  // Handle different YouTube URL formats
  if (url.includes("youtube.com/watch")) {
    // https://www.youtube.com/watch?v=VIDEO_ID
    const urlParams = new URL(url).searchParams;
    videoId = urlParams.get("v") || "";
  } else if (url.includes("youtube.com/embed/")) {
    // Already an embed URL, extract video ID
    videoId = url.split("embed/")[1]?.split("?")[0] || "";
  } else if (url.includes("youtu.be/")) {
    // https://youtu.be/VIDEO_ID
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (url.includes("youtube.com/v/")) {
    // https://www.youtube.com/v/VIDEO_ID
    videoId = url.split("/v/")[1]?.split("?")[0] || "";
  }

  if (!videoId) {
    // Return original URL if we can't parse it
    return url;
  }

  // Return embed URL with autoplay, mute, loop, and no controls
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&enablejsapi=1&rel=0&showinfo=0&modestbranding=1`;
}

export function HeroSlide({ slide, isActive }: HeroSlideProps) {
  const isVideo = slide.background.type === "video";
  const isYouTube = slide.background.type === "youtube";


  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Background with Parallax/Zoom Effect */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 transition-transform duration-8000 ease-in-out ${isActive ? "scale-110" : "scale-100"
            }`}
        >
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(slide.background.src)}
              className="w-full h-full object-cover pointer-events-none"
              allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"
              allowFullScreen
              title={slide.background.alt || "Video background"}
              style={{
                border: "none",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1.5)",
              }}
            />
          ) : isVideo ? (
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
      <div className="relative h-full flex items-center px-6 sm:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="max-w-3xl w-full">
          <div
            className={`flex flex-col gap-6 transition-all duration-1000 delay-300 ${isActive
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
              }`}
          >
            {/* Tagline */}
            {slide.tagline && (
              <span className="text-sm sm:text-base text-accent font-medium tracking-wide">
                {slide.tagline}
              </span>
            )}

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight text-balance drop-shadow-lg">
              {slide.headline.split(" ").map((word: string, idx: number) => (
                <span key={idx}>
                  {word === "UK" ||
                    word === "University" ||
                    word === "Global" ||
                    word === "Universities" ? (
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-primary-foreground">
                      {word}
                    </span>
                  ) : (
                    word
                  )}{" "}
                </span>
              ))}
            </h1>

            {/* Stats Grid - Glassmorphism - Only show if stats exist */}
            {slide.stats && slide.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:gap-8 py-6 my-2 border-y border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-6">
                {slide.stats.map(
                  (stat: { number: string; label: string }, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col relative group/stat"
                    >
                      <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-accent mb-1">
                        {stat.number}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wider">
                        {stat.label}
                      </span>
                      {/* Decorative line */}
                      <div className="absolute -left-4 top-2 bottom-2 w-px bg-white/10 hidden sm:block first:hidden" />
                    </div>
                  )
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              {slide.cta.href && slide.cta.text && (
                <Link
                  href={slide.cta.href}
                  className="group relative inline-flex items-center gap-3 px-8 py-3 bg-primary text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">{slide.cta.text}</span>
                  <ArrowRight className="w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}

              {slide.learnMoreText && slide.learnMoreUrl && (
                <Link
                  href={slide.learnMoreUrl}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  {slide.learnMoreText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
