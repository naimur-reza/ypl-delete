 
import { Event } from "../../../../../../prisma/src/generated/prisma/browser";
import { EventCard } from "./event-card";
import { EventFilters } from "./event-filters";

interface UpcomingEventsGridProps {
  events: Event[];
}

export function UpcomingEventsGrid({ events }: UpcomingEventsGridProps) {
  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl">
            Join us at our upcoming education fairs, webinars, and university open days. 
            Connect with university representatives and explore your study abroad options.
          </p>
        </div>

        {/* Filters */}
        <EventFilters />

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Load More or Pagination */}
        {events.length > 9 && (
          <div className="mt-12 flex justify-center">
            <button className="px-8 py-3 bg-white border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300">
              Load More Events
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
