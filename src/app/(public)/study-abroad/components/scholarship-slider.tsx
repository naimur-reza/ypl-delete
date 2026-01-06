"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Scholarship {
  id: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  slug: string;
  createdAt: Date;
}

interface ScholarshipSliderProps {
  scholarships: Scholarship[];
  title?: string;
}

export function ScholarshipSlider({
  scholarships,
  title = "How to choose the courses perfect for your goals",
}: ScholarshipSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  if (scholarships.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 px-6 overflow-hidden bg-slate-900">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="opacity-10"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-blue-400"
            />
            <circle
              cx="100"
              cy="100"
              r="95"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-blue-400"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {title}
          </h2>
        </div>

        <div className="relative">
          <div className="absolute -bottom-16 right-4 flex gap-2 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full bg-blue-600 hover:bg-blue-700"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="shrink-0 w-[300px] bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <p className="text-sm text-slate-500 mb-3">
                  {new Date(scholarship.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">
                  {scholarship.title}
                </h3>

                {(scholarship.summary || scholarship.description) && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {scholarship.summary || scholarship.description}
                  </p>
                )}

                <Link
                  href={`/scholarships/${scholarship.slug}`}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
