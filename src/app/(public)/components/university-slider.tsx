"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { GradientButton } from "@/components/ui/gradient-button";
import { University } from "../../../../prisma/src/generated/prisma/client";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

interface UniversitySliderProps {
  universities: University[];
  destinationId?: string;
}

export function UniversitySlider({ universities, destinationId }: UniversitySliderProps) {
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="w-full py-14 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Meet <span className="text-primary">750+ institutions</span> around
            the world
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            We partner with top-ranked universities globally to provide you with
            the best education opportunities. Start your journey with a trusted
            institution.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative group px-4 md:px-12">
          
          {/* Custom Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
             aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="!pb-10"
          >
            {universities.map((uni) => (
              <SwiperSlide key={uni.id} className="h-auto">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 h-full flex flex-col group/card cursor-pointer">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        uni.thumbnail ||
                        "https://www.wfla.com/wp-content/uploads/sites/71/2025/06/Sydney.jpg?strip=1"
                      }
                      alt={uni.name}
                      width={340}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover/card:translate-y-0">
                      <MapPin className="w-3 h-3" />
                      <span>United Kingdom</span>
                    </div>
                  </div>

                  {/* Content */}
                  <CountryAwareLink
                    href={`/universities/${uni.slug}`}
                    className="p-6 flex-1 flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover/card:text-primary transition-colors">
                      {uni.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                      {uni.description ||
                        "A leading institution known for academic excellence and research innovation."}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400 text-sm group-hover/card:translate-x-1 transition-transform duration-300">
                        View details →
                      </span>
                    </div>
                  </CountryAwareLink>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Footer Action */}
        <div className="flex justify-center mt-8">
          <GradientButton variant="secondary" className="px-8">
            <CountryAwareLink
              href={
                destinationId
                  ? `/universities?destinationId=${destinationId}`
                  : "/universities"
              }
            >
              Explore All Universities
            </CountryAwareLink>
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
