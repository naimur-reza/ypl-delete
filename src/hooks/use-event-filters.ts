import { useMemo, useCallback } from "react";
import { EventWithRelations } from "@/lib/events";
import { useFilter, FilterState } from "./use-filter";
import {
  eventFilterConfig,
  eventSearchFields,
  getEventFilterOptions,
} from "@/lib/event-filter-config";
import { FilterOption } from "@/components/filters/reusable-filter";

interface UseEventFiltersOptions {
  events: EventWithRelations[];
  enableSearch?: boolean;
}

interface UseEventFiltersReturn {
  filteredEvents: EventWithRelations[];
  filters: FilterState;
  filterOptions: FilterOption[];
  toggleFilter: (category: string, value: string) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  activeFilterCount: number;
  // Single-select helpers for filter bar
  handleSingleSelectFilter: (
    category: "month" | "eventType" | "location",
    value: string
  ) => void;
  selectedFilters: {
    month: string;
    eventType: string;
    location: string;
  };
}

/**
 * Shared hook for event filtering
 * Used by both home page events section and events listing page
 */
export function useEventFilters({
  events,
  enableSearch = false,
}: UseEventFiltersOptions): UseEventFiltersReturn {
  // Extract filter options
  const filterOptions = useMemo(() => getEventFilterOptions(events), [events]);

  // Use the shared filter hook
  const {
    filters,
    filteredData,
    toggleFilter,
    clearFilters,
    setSearchQuery,
    searchQuery,
    activeFilterCount,
  } = useFilter({
    data: events,
    filterConfig: eventFilterConfig,
    searchFields: enableSearch ? eventSearchFields : [],
  });

  // Handle single-select filter changes (for filter bar)
  const handleSingleSelectFilter = useCallback(
    (category: "month" | "eventType" | "location", value: string) => {
      const currentValues = filters[category] || [];

      // Treat "all" as clearing the filter
      if (value === "all") {
        currentValues.forEach((val) => toggleFilter(category, val));
        return;
      }

      // If already selected, remove it (clear filter)
      if (currentValues.includes(value)) {
        toggleFilter(category, value);
        return;
      }

      // Clear existing selection first (single select behavior)
      currentValues.forEach((val) => toggleFilter(category, val));
      toggleFilter(category, value);
    },
    [filters, toggleFilter]
  );

  // Get selected filter values for the filter bar (single select)
  const selectedFilters = useMemo(
    () => ({
      month: filters.month?.[0] || "all",
      eventType: filters.eventType?.[0] || "all",
      location: filters.location?.[0] || "all",
    }),
    [filters]
  );

  return {
    filteredEvents: filteredData,
    filters,
    filterOptions,
    toggleFilter,
    clearFilters,
    setSearchQuery,
    searchQuery,
    activeFilterCount,
    handleSingleSelectFilter,
    selectedFilters,
  };
}
