"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SliderPost = {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  image: string | null;
  publishedAt: Date | null;
};

const getDateLabel = (date: Date | null) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

const buildHref = (slug: string, countrySlug?: string | null) =>
  countrySlug ? `/${countrySlug}/blogs/${slug}` : `/blogs/${slug}`;

export function BlogSlider({
  posts,
  countrySlug,
}: {
  posts: SliderPost[];
  countrySlug?: string | null;
}) {
  const slides = useMemo(() => posts.filter(Boolean), [posts]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      5000
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="relative w-full mx-auto px-8 md:px-12 py-12">
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
          Fresh blog highlights will appear here once available.
        </div>
      </div>
    );
  }

  const currentSlide = slides[current % slides.length];
  const href = buildHref(currentSlide.slug, countrySlug);

  return (
    <div className="relative w-full mx-auto px-8 md:px-12 py-12">
      {/* Prev Button */}
      <button
        onClick={() =>
          setCurrent((c) => (c - 1 + slides.length) % slides.length)
        }
        className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 flex items-center justify-center rounded-xl shadow-lg z-20 transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Next Button */}
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 flex items-center justify-center rounded-xl shadow-lg z-20 transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Slider */}
      <div className="relative bg-[#020817] rounded-sm overflow-hidden min-h-[500px] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* LEFT CONTENT */}
          <div className="relative z-10 p-8 md:p-16 flex flex-col justify-center">
            <div className="text-slate-400 mb-4 font-medium tracking-wide">
              {getDateLabel(currentSlide.publishedAt)}
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {currentSlide.title}
            </h2>

            {currentSlide.excerpt && (
              <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-2xl line-clamp-2">
                {currentSlide.excerpt}
              </p>
            )}

            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-black font-bold rounded-xl px-8 py-6 text-base transition-transform hover:scale-105 w-fit"
            >
              <Link href={href}>Read more</Link>
            </Button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative hidden lg:block">
            {currentSlide.image ? (
              <>
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  priority
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-[#020817]/90 via-[#020817]/50 to-transparent" />
              </>
            ) : (
              <div className="h-full w-full bg-slate-800" />
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                current === idx
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-slate-700 hover:bg-slate-600"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
