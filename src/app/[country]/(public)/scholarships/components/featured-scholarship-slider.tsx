"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Scholarship } from "../../../../../../prisma/src/generated/prisma/browser";

import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

type TScholarship = Scholarship & {
  destination?: {
    id: string;
    name: string;
  } | null;
  university?: {
    id: string;
    name: string;
  } | null;
};

interface FeaturedScholarshipSliderProps {
  scholarships: TScholarship[];
}

export default function FeaturedScholarshipSlider({
  scholarships,
}: FeaturedScholarshipSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Consider the first 4-6 scholarships as featured
  const featuredScholarships = scholarships.slice(0, 6);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (featuredScholarships.length === 0) return null;

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase mb-2 block">
              Exclusive Opportunities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-800">
                Scholarships
              </span>{" "}
              2025
            </h2>
            <p className="text-slate-600 mt-4 text-lg">
              Handpicked scholarships with high acceptance rates for
              international students.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredScholarships.map((item) => (
            <div
              key={item.id}
              className="min-w-[340px] md:min-w-[380px] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden snap-center group hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop"
                  }
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-xs uppercase tracking-wider">
                  {item.university?.name || "University Scholarship"}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 flex items-end">
                  <div className="text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">
                      {item.destination?.name || "Global"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                {item.summary && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.summary && (
                      <span className="bg-slate-50 text-slate-600 text-sm px-2 py-1 rounded-md font-medium border border-slate-100">
                        {item.summary}
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-3 mb-6 text-sm text-slate-600 grow">
                  {/* <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Multiple Levels Available</span>
                  </div> */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Deadline:{" "}
                      {item.deadline
                        ? new Date(item.deadline).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Rolling"}
                    </span>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 mt-2">
                    <p className="text-xs text-blue-800 font-semibold mb-1">
                      Scholarship Amount
                    </p>
                    <p className="text-blue-600 font-bold">
                      {item.amount
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                          }).format(item.amount)
                        : "Up to 100% Tuition"}
                    </p>
                  </div>
                </div>

                <CountryAwareLink
                  href={`/scholarships/${item.slug}`}
                  className="w-full mt-auto bg-slate-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors duration-300"
                >
                  Show Details
                  <ArrowRight className="w-4 h-4" />
                </CountryAwareLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
