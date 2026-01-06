import { FilterOption } from "@/components/filters/reusable-filter";

interface University {
  id: string;
  name: string;
  destination?: {
    id: string;
    name: string;
  } | null;
}

export function extractUniversityFilterOptions(
  universities: University[]
): FilterOption[] {
  // Extract unique destinations with counts
  const destinationMap = new Map<string, { name: string; count: number }>();
  universities.forEach((uni) => {
    if (uni.destination) {
      const key = uni.destination.id;
      const existing = destinationMap.get(key);
      destinationMap.set(key, {
        name: uni.destination.name,
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

  return [
    {
      id: "destination",
      label: "Study Destination",
      options: destinationOptions,
    },
  ];
}
