"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
 
import { GradientButton } from "@/components/ui/gradient-button";
import { University } from "../../../../prisma/src/generated/prisma/client";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
 

interface UniversitySliderProps {
  universities: University[];
}

export function UniversitySlider({ universities }: UniversitySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-14 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Meet <span className="text-primary">750+ institutions</span> around the world
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            We partner with top-ranked universities globally to provide you with the best education opportunities. 
            Start your journey with a trusted institution.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Left Fade & Button */}
          <div 
            className={`absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-slate-50 to-transparent z-20 flex items-center transition-opacity duration-300 ${
              showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={() => scroll("left")}
              className="ml-2 w-12 h-12 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Right Fade & Button */}
          <div 
            className={`absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-slate-50 to-transparent z-20 flex items-center justify-end transition-opacity duration-300 ${
              showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={() => scroll("right")}
              className="mr-2 w-12 h-12 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none" 
            }}
          >
            {universities.map((uni) => (
              <div 
                key={uni.id} 
                className="shrink-0 w-[300px] md:w-[340px] snap-center group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={uni.thumbnail || "https://www.wfla.com/wp-content/uploads/sites/71/2025/06/Sydney.jpg?strip=1"}
                      alt={uni.name}
                      width={340}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Location Badge (Mock data if not in schema) */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <MapPin className="w-3 h-3" />
                      <span>United Kingdom</span>
                    </div>
                  </div>

                  {/* Content */}
                  <CountryAwareLink href={`/university/${uni.id}`} className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {uni.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                      {uni.description || "A leading institution known for academic excellence and research innovation."}
                    </p>
                    
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                        Top Ranked
                      </span>
                      <span className="text-slate-400 text-sm group-hover:translate-x-1 transition-transform duration-300">
                        View details →
                      </span>
                    </div>
                  </CountryAwareLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-center mt-12">
          <GradientButton variant="secondary" className="px-8">
            Explore all universities
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
