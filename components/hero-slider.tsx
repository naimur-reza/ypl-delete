"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
    description: "We connect exceptional talent with forward-thinking organizations. From permanent placements to executive search, we deliver recruitment solutions that transform businesses.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80",
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
        if (data && data.length > 0) {
          setSlides(data);
        } else {
          setSlides(fallbackSlides);
        }
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
    <section className="relative min-h-[90vh] overflow-hidden bg-secondary">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="m-0">
          {slides.map((slide) => (
            <CarouselItem key={slide._id} className="p-0">
              <div className="relative min-h-[90vh] flex items-center">
                {/* Background */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-secondary/85" />
                </div>

                {/* Content */}
                <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl py-20 animate-in fade-in slide-in-from-left duration-700">
                    <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-lg">
                      {slide.badgeText}
                    </span>
                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl lg:text-6xl">
                      {slide.title}{" "}
                      <span className="block text-primary">{slide.highlightText}</span>
                    </h1>
                    <SafeHtmlContent
                      content={slide.description}
                      className="mt-6 text-lg leading-relaxed text-secondary-foreground/80"
                    />
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                      {slide.primaryBtnText && (
                        <Button
                          size="lg"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          asChild
                        >
                          <Link href={slide.primaryBtnLink || "#"}>
                            {slide.primaryBtnText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {slide.secondaryBtnText && (
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                          asChild
                        >
                          <Link href={slide.secondaryBtnLink || "#"}>
                            {slide.secondaryBtnText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === current ? "w-8 bg-primary" : "w-2 bg-primary/30"
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        )}
      </Carousel>
    </section>
  );
}
