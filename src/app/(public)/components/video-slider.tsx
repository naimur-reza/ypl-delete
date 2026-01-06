"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function PartnerVideoSlider() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dummy Data - Replace images with actual video thumbnails
  const partners = [
    {
      id: 1,
      name: "Mark Whitfield",
      role: "University of Hertfordshire",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Ismat Abu Shihab",
      role: "University of Bradford",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Mathew Virr",
      role: "Liverpool John Moores",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Thomas Guers",
      role: "OnCampus",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Sarah Jenkins",
      role: "University of Leeds",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "David Chen",
      role: "Monash University",
      image:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
    },
  ];

  // Scroll Handler for Buttons
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of card + gap
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

  // Update Progress Bar on Scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      const progress = (scrollLeft / totalScrollable) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Text */}
        <div className="mb-12">
          <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">
            Our partners
          </span>
          <h2 className="section-title">Meet our partners</h2>
          <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">
            Explore Inspirational Testimonials from Our Esteemed University
            Partners, Sharing Their Support for Study Abroad Global and its
            Impactful Journey.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Scrollable Area */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="relative  shrink-0 w-[280px] md:w-[320px] aspect-3/4 rounded-3xl overflow-hidden snap-center cursor-pointer group/card"
              >
                {/* Background Image */}
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />

                {/* Dark linear Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                {/* Play Button (Hover Effect) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between z-20">
                  <div className="flex-1 mr-4">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                      {partner.name}
                    </h3>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">
                      {partner.role}
                    </p>
                  </div>

                  {/* Small Corner Play Icon */}
                  <div className="w-10 h-10 rounded-xl border border-gray-400/50 flex items-center justify-center text-white group-hover/card:bg-white group-hover/card:text-black transition-colors duration-300">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls & Progress Bar */}
        <div className="flex items-center gap-6 mt-4">
          {/* Arrows */}
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 h-0.5 bg-slate-200 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-slate-900 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
