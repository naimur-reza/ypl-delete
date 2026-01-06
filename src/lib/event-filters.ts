import { EventWithRelations } from "./events";
import { FilterOption } from "@/components/filters/reusable-filter";

const EVENT_TYPE_LABELS: Record<string, string> = {
  EXPO: "Education Expo / Fair",
  WEBINAR: "Virtual Event / Webinar",
  ADMISSION_DAY: "Application / Admission Day",
  OPEN_DAY: "Spot Admission / Offer Day",
  SEMINAR: "Education Seminar / Workshop",
  WORKSHOP: "Workshop",
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function extractEventFilterOptions(
  events: EventWithRelations[]
): FilterOption[] {
  // 1️⃣ Event Type Options
  const eventTypeMap = new Map<string, number>();
  events.forEach((event) => {
    const type = event.eventType;
    eventTypeMap.set(type, (eventTypeMap.get(type) || 0) + 1);
  });

  const eventTypeOptions = Array.from(eventTypeMap.entries())
    .map(([value, count]) => ({
      label: EVENT_TYPE_LABELS[value] || value.replace("_", " "),
      value,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Add "All Types" option
  eventTypeOptions.unshift({
    label: "All Event Types",
    value: "all",
    count: events.length,
  });

  // 2️⃣ Destination Options
  const destinationMap = new Map<string, { name: string; count: number }>();
  events.forEach((event) => {
    if (event.destination) {
      const key = event.destination.id;
      const existing = destinationMap.get(key);
      destinationMap.set(key, {
        name: event.destination.name,
        count: (existing?.count || 0) + 1,
      });
    }
  });

  const destinationOptions = Array.from(destinationMap.entries())
    .map(([value, data]) => ({
      label: data.name,
      value,
      count: data.count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Add "All Destinations" option
  destinationOptions.unshift({
    label: "All Destinations",
    value: "all",
    count: events.length,
  });

  // 3️⃣ Location Options (top 20)
  const locationMap = new Map<string, number>();
  events.forEach((event) => {
    if (event.location) {
      const location = event.location.trim();
      if (location) {
        locationMap.set(location, (locationMap.get(location) || 0) + 1);
      }
    }
  });

  const locationOptions = Array.from(locationMap.entries())
    .map(([value, count]) => ({
      label: value,
      value: value.toLowerCase().replace(/\s+/g, "-"),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Add "All Cities" option if there are locations
  if (locationOptions.length > 0) {
    locationOptions.unshift({
      label: "All Cities",
      value: "all",
      count: events.length,
    });
  }

  // 4️⃣ Month Options
  const monthMap = new Map<string, number>();
  events.forEach((event) => {
    if (!event.startDate) return;
    const date = new Date(event.startDate);
    if (isNaN(date.getTime())) return;

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // 0-based month
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
  });

  const monthOptions = Array.from(monthMap.entries())
    .map(([value, count]) => {
      const [year, month] = value.split("-");
      return {
        label: `${MONTH_NAMES[parseInt(month)]} ${year}`,
        value,
        count,
      };
    })
    .sort((a, b) => {
      const [yearA, monthA] = a.value.split("-").map(Number);
      const [yearB, monthB] = b.value.split("-").map(Number);
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    });

  // Add "All Months" option
  monthOptions.unshift({
    label: "All Months",
    value: "all",
    count: events.length,
  });

  // 5️⃣ Combine all filters
  return [
    {
      id: "eventType",
      label: "Event Type",
      options: eventTypeOptions,
    },
    {
      id: "destination",
      label: "Study Destination",
      options: destinationOptions,
    },
    ...(locationOptions.length > 0
      ? [
          {
            id: "location",
            label: "City",
            options: locationOptions,
          },
        ]
      : []),
    {
      id: "month",
      label: "Event Month",
      options: monthOptions,
    },
  ];
}
