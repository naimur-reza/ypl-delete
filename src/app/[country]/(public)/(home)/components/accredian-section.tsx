"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type AccreditationItem = {
  id: string;
  name: string;
  logo?: string | null;
  website?: string | null;
};

type AccredianSectionProps = {
  accreditations?: AccreditationItem[];
  title?: string;
  highlightedWord?: string;
};

export function AccredianSection({
  accreditations = [],
  title = "As seen in the",
  highlightedWord = "News",
}: AccredianSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // How far to scroll on click

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };
 
  return (
    <section className="bg-white py-14 border-t border-gray-100 relative group">
      {/* Inline style to hide scrollbar for a cleaner look */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">
            {title} <span className="text-primary">{highlightedWord}</span>
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Left Fade & Button */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10 flex items-center">
            <button
              onClick={() => scroll("left")}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all -ml-4 border border-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          {/* Right Fade & Button */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10 flex items-center justify-end">
            <button
              onClick={() => scroll("right")}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all -mr-4 border border-gray-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 py-4 hide-scrollbar scroll-smooth items-center"
          >
            {accreditations.length > 0 ? (
              accreditations.map((accreditation) => (
                <div
                  key={accreditation.id}
                  className="shrink-0 w-[180px] h-28 bg-gray-50 rounded-2xl flex items-center justify-center p-6 
                            hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 border border-transparent hover:border-gray-100 cursor-pointer"
                  onClick={() => {
                    if (accreditation.website) {
                      window.open(
                        accreditation.website,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={accreditation.logo || "/logo.svg"}
                    alt={accreditation.name}
                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-500"
                    onError={(e) => {
                      // Fallback to a default logo if image fails to load
                      (e.target as HTMLImageElement).src = "/logo.svg";
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 w-full py-8">
                No accreditations available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
