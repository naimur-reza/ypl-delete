import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventCard } from "./event-card";
import { Event } from "../../../../../../prisma/src/generated/prisma/client";
 

interface RelatedEventsSectionProps {
  events: Event[];
  countrySlug?: string;
}

export function RelatedEventsSection({ events, countrySlug }: RelatedEventsSectionProps) {
  if (!events || events.length === 0) {
    return null;
  }

  



  const baseUrl = countrySlug ? `/${countrySlug}/events` : "/events";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Related Events
            </h2>
            <p className="text-slate-600">
              Explore more upcoming education events near you
            </p>
          </div>
          <Link
            href={baseUrl}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-full transition-all duration-300 font-medium"
          >
            View All Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href={baseUrl}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium"
          >
            View All Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
