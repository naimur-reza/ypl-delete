"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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
      5000,
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Prev Button */}
      <button
        onClick={() =>
          setCurrent((c) => (c - 1 + slides.length) % slides.length)
        }
        className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-14 h-14 flex items-center justify-center rounded-xl shadow-lg z-20 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      {/* Next Button */}
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-14 h-14 flex items-center justify-center rounded-xl shadow-lg z-20 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform duration-300" />
      </button>

      {/* Slider */}
      <div className="relative bg-gradient-to-br from-[#020817] via-[#0f172a] to-[#020817] rounded-2xl overflow-hidden min-h-[500px] shadow-2xl border border-white/5">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full relative z-10">
          {/* LEFT CONTENT */}
          <div className="relative z-10 p-8 md:p-16 flex flex-col justify-center">
            <div className="text-slate-400 mb-4 font-medium tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {getDateLabel(currentSlide.publishedAt)}
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight transition-all duration-500">
              {currentSlide.title}
            </h2>

            {currentSlide.excerpt && (
              <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-2xl line-clamp-2 transition-all duration-500">
                {currentSlide.excerpt}
              </p>
            )}

            <Button
              asChild
              className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-black font-bold rounded-xl px-8 py-6 text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 w-fit group"
            >
              <Link href={href}>
                Read more
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
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
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-[#020817]/95 via-[#020817]/60 to-transparent" />
                {/* Animated overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/10 opacity-0 animate-pulse" />
              </>
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900" />
            )}
          </div>
        </div>

        {/* Enhanced Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 transform hover:scale-110",
                current === idx
                  ? "w-8 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/50"
                  : "w-2 bg-slate-700 hover:bg-slate-600",
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
