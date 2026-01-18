"use client";

import { EventWithRelations } from "@/lib/events";
import { EventCard } from "@/components/events/event-card";
import { ReusableFilter } from "@/components/filters/reusable-filter";
import { useEventFilters } from "@/hooks/use-event-filters";

interface EventListingProps {
  events: EventWithRelations[];
}

export function EventListing({ events }: EventListingProps) {
  // Use shared event filters hook with search enabled
  const {
    filteredEvents,
    filterOptions,
    filters,
    searchQuery,
    toggleFilter,
    clearFilters,
    setSearchQuery,
  } = useEventFilters({
    events,
    enableSearch: true,
  });

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ReusableFilter
              filters={filterOptions}
              selectedFilters={filters}
              onFilterChange={toggleFilter}
              onClearAll={clearFilters}
              searchPlaceholder="Search events..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              defaultOpenSections={["eventType", "country", "destination", "city", "month"]}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Showing {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "Event" : "Events"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Date (Earliest First)</option>
                  <option>Date (Latest First)</option>
                  <option>Event Type</option>
                  <option>Location</option>
                </select>
              </div>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} variant="page" />
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-lg">No events found.</p>
                <p className="text-slate-400 text-sm mt-2">
                  {Object.keys(filters).length > 0 || searchQuery
                    ? "Try adjusting your filters or search query."
                    : "Check back later for new events."}
                </p>
              </div>
            )}

            {/* Pagination Mockup */}
            {filteredEvents.length > 0 && (
              <div className="mt-12 flex justify-center gap-2">
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary text-white">
                  1
                </button>
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  2
                </button>
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  3
                </button>
                <span className="px-2 py-2 text-slate-400">...</span>
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
