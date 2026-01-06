"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/generated/prisma/client";
import { GradientButton } from "@/components/ui/gradient-button";

interface FeaturedEventSliderProps {
  events: Event[];
}

export function FeaturedEventSlider({ events }: FeaturedEventSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentEvent = events[currentIndex];

  // Countdown timer
  useEffect(() => {
    if (!currentEvent) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventDate = new Date(currentEvent.startDate).getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEvent]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  if (events.length === 0) return null;

  return (
    <section className="relative bg-slate-900 overflow-hidden">
      <div className="relative h-[600px] md:h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            alt={currentEvent.title}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
          <div className="w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Event Info */}
            <div className="text-white">
              <div className="inline-block bg-primary px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-bold uppercase tracking-wider">Featured Event</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {currentEvent.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{new Date(currentEvent.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                {currentEvent.location && (
                  <div className="flex items-center gap-3 text-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{currentEvent.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{new Date(currentEvent.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <GradientButton   className="px-8">
                Register Now
              </GradientButton>
            </div>

            {/* Right: Countdown */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-10">
              <h3 className="text-white text-2xl font-bold mb-8 text-center">Event Starts In</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Minutes', value: countdown.minutes },
                  { label: 'Seconds', value: countdown.seconds },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-2">
                      <span className="text-4xl md:text-5xl font-bold text-white block">
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-white/80 text-sm uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {events.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {events.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
