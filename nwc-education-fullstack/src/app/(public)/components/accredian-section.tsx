"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AccredianSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const newsLogos = [
    { name: "The PIE News", src: "https://logo.clearbit.com/thepienews.com" },
    { name: "ANI News", src: "https://logo.clearbit.com/aninews.in" },
    {
      name: "The Business Standard",
      src: "https://logo.clearbit.com/tbsnews.net",
    },
    { name: "India Today", src: "https://logo.clearbit.com/indiatoday.in" },
    { name: "ICEF Monitor", src: "https://logo.clearbit.com/icef.com" },
    {
      name: "Times of India",
      src: "https://logo.clearbit.com/timesofindia.indiatimes.com",
    },
    { name: "BBC", src: "https://logo.clearbit.com/bbc.com" },
    { name: "CNN", src: "https://logo.clearbit.com/cnn.com" },
    { name: "Forbes", src: "https://logo.clearbit.com/forbes.com" },
  ];

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
            As seen in the <span className="text-primary">News</span>
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
            {newsLogos.map((logo, index) => (
              <div
                key={index}
                className="shrink-0 w-[180px] h-28 bg-gray-50 rounded-2xl flex items-center justify-center p-6 
                           hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 border border-transparent hover:border-gray-100 cursor-pointer"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="w-full h-full object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
