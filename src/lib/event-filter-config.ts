import { EventWithRelations } from "./events";
import { extractEventFilterOptions } from "./event-filters";
import { FilterOption } from "@/components/filters/reusable-filter";
import { UseFilterOptions } from "@/hooks/use-filter";

/**
 * Shared filter configuration for events
 * Used by both home page events section and events listing page
 */
export const eventFilterConfig: UseFilterOptions<EventWithRelations>["filterConfig"] =
  {
    eventType: {
      getValue: (event) => event.eventType,
      matchType: "exact",
    },
    destination: {
      getValue: (event) => event.destination?.id,
      matchType: "exact",
    },
    location: {
      getValue: (event) => {
        // Return slugified version for matching with filter values
        if (event.location) {
          return event.location.toLowerCase().replace(/\s+/g, "-");
        }
        return null;
      },
      matchType: "exact",
    },
    month: {
      getValue: (event) => {
        const date = new Date(event.startDate);
        return `${date.getFullYear()}-${date.getMonth()}`;
      },
      matchType: "exact",
    },
  };

/**
 * Search fields configuration for event search
 */
export const eventSearchFields: UseFilterOptions<EventWithRelations>["searchFields"] =
  [
    (event) => event.title,
    (event) => event.description,
    (event) => event.location,
  ];

/**
 * Wrapper around extractEventFilterOptions for consistency
 */
export function getEventFilterOptions(
  events: EventWithRelations[]
): FilterOption[] {
  return extractEventFilterOptions(events);
}
