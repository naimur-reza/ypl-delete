import { FilterOption } from "@/components/filters/reusable-filter";

interface Scholarship {
  id: string;
  title: string;
  destination?: {
    id: string;
    name: string;
  } | null;
  university?: {
    id: string;
    name: string;
  } | null;
}

export function extractScholarshipFilterOptions(
  scholarships: Scholarship[]
): FilterOption[] {
  // Extract unique destinations with counts
  const destinationMap = new Map<string, { name: string; count: number }>();
  scholarships.forEach((scholarship) => {
    if (scholarship.destination) {
      const key = scholarship.destination.id;
      const existing = destinationMap.get(key);
      destinationMap.set(key, {
        name: scholarship.destination.name,
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

  // Extract unique universities with counts
  const universityMap = new Map<string, { name: string; count: number }>();
  scholarships.forEach((scholarship) => {
    if (scholarship.university) {
      const key = scholarship.university.id;
      const existing = universityMap.get(key);
      universityMap.set(key, {
        name: scholarship.university.name,
        count: (existing?.count || 0) + 1,
      });
    }
  });

  const universityOptions = Array.from(universityMap.entries())
    .map(([value, data]) => ({
      label: data.name,
      value,
      count: data.count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, 50); // Limit to top 50 universities

  return [
    {
      id: "destination",
      label: "Study Destination",
      options: destinationOptions,
    },
    ...(universityOptions.length > 0
      ? [
          {
            id: "university",
            label: "University",
            options: universityOptions,
          },
        ]
      : []),
  ];
}
