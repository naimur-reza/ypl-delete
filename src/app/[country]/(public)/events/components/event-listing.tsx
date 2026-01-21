"use client";

import { useState, useMemo } from "react";
import { EventWithRelations } from "@/lib/events";
import { EventCard } from "@/components/events/event-card";
import { ReusableFilter } from "@/components/filters/reusable-filter";
import { useEventFilters } from "@/hooks/use-event-filters";

interface EventListingProps {
  events: EventWithRelations[];
}

const ITEMS_PER_PAGE = 6;

export function EventListing({ events }: EventListingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of listing
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                Showing {paginatedEvents.length} of {filteredEvents.length}{" "}
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

            {paginatedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {paginatedEvents.map((event) => (
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

            {/* Dynamic Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {getPageNumbers().map((page, index) => (
                  typeof page === 'number' ? (
                    <button
                      key={index}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={index} className="px-2 py-2 text-slate-400">
                      {page}
                    </span>
                  )
                ))}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* Page info */}
            {totalPages > 1 && (
              <div className="mt-4 text-center text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

