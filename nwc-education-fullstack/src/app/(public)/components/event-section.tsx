"use client";

import { useMemo } from "react";
import { EventWithRelations } from "@/lib/events";
import { EventFilterBar } from "@/components/events/event-filter-bar";
import { EventCard } from "@/components/events/event-card";
import { useEventFilters } from "@/hooks/use-event-filters";

type EventsSectionProps = {
  events?: EventWithRelations[];
};

export default function EventsSection({ events }: EventsSectionProps) {
  const eventsList = useMemo(() => events || [], [events]);

  // Use shared event filters hook
  const {
    filteredEvents,
    filterOptions,
    handleSingleSelectFilter,
    selectedFilters,
    filters,
  } = useEventFilters({
    events: eventsList,
    enableSearch: false,
  });

  const hasActiveFilters = Object.keys(filters).length > 0;
  
  // If no filters are active, show only the first 3 events.
  // If filters ARE active, show all matching events.
  const displayEvents = filteredEvents.length > 0 
    ? (hasActiveFilters ? filteredEvents : filteredEvents.slice(0, 3))
    : [];

  return (
    <section className="relative bg-white py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-12 max-w-3xl">
          <h2 className="section-title">
            University fairs, webinars, and open days
          </h2>
        </div>

        {/* Filter Bar */}
        {eventsList.length > 0 && (
          <EventFilterBar
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleSingleSelectFilter}
          />
        )}

        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="home" />
            ))}
          </div>
        ) : hasActiveFilters ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-lg font-medium mb-2">
              No events found
            </p>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters to see more events.
            </p>
          </div>
        ) : eventsList.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-lg font-medium mb-2">
              No upcoming events
            </p>
            <p className="text-gray-500 text-sm">
              Check back later for new events.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
