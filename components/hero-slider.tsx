"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";

interface HeroSlide {
  _id: string;
  badgeText: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
}

const fallbackSlides: HeroSlide[] = [
  {
    _id: "fallback-1",
    badgeText: "Your Trusted Recruitment Partner",
    title: "Building Teams That",
    highlightText: "Drive Success",
    description:
      "We connect exceptional talent with forward-thinking organizations. From permanent placements to executive search.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80",
    primaryBtnText: "Find Your Next Role",
    primaryBtnLink: "/job-seekers",
    secondaryBtnText: "Hire Top Talent",
    secondaryBtnLink: "/employers",
  },
];

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/hero?active=true")
      .then((res) => res.json())
      .then((data) => {
        setSlides(data?.length > 0 ? data : fallbackSlides);
      })
      .catch(() => setSlides(fallbackSlides));
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative h-[92vh] w-full overflow-hidden bg-black">
      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
        className="h-full w-full"
        opts={{ loop: true }}
      >
        <CarouselContent className="m-0 h-[92vh]">
          {slides.map((slide, index) => (
            <CarouselItem key={slide._id} className="relative p-0 h-full">
              {/* Image Container with Zoom Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: current === index ? 1 : 1.1 }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </motion.div>
                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content Layer */}
              <div className="relative mx-auto h-full max-w-7xl px-6 lg:px-8">
                <div className="flex h-full flex-col justify-center">
                  <div className="max-w-2xl">
                    <AnimatePresence mode="wait">
                      {current === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, staggerChildren: 0.1 }}
                        >
                          <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur-md"
                          >
                            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
                            {slide.badgeText}
                          </motion.span>

                          <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                          >
                            {slide.title}
                            <span className="mt-2 block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                              {slide.highlightText}
                            </span>
                          </motion.h1>

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <SafeHtmlContent
                              content={slide.description}
                              className="mt-6 text-xl leading-relaxed text-gray-300 antialiased"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-10 flex flex-wrap gap-4"
                          >
                            <Button
                              size="lg"
                              className="h-14 rounded-full px-8 text-lg font-semibold shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95"
                              asChild
                            >
                              <Link href={slide.primaryBtnLink || "#"}>
                                {slide.primaryBtnText}
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </Link>
                            </Button>

                            <Button
                              size="lg"
                              variant="outline"
                              className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
                              asChild
                            >
                              <Link href={slide.secondaryBtnLink || "#"}>
                                {slide.secondaryBtnText}
                              </Link>
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation Controls */}
        <div className="absolute bottom-12 right-12 hidden gap-3 lg:flex">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-primary"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-primary"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Modern Animated Indicators */}
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className="group relative h-1 w-12 overflow-hidden rounded-full bg-white/20 transition-all"
            >
              {current === index && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-0 bg-primary"
                />
              )}
              <div className="absolute inset-0 h-full w-full opacity-0 transition-opacity group-hover:bg-white/10 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </Carousel>
    </section>
  );
}
