import { FilterOption } from "@/components/filters/reusable-filter";

interface Course {
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

export function extractCourseFilterOptions(courses: Course[]): FilterOption[] {
  // Extract unique destinations with counts
  const destinationMap = new Map<string, { name: string; count: number }>();
  courses.forEach((course) => {
    if (course.destination) {
      const key = course.destination.id;
      const existing = destinationMap.get(key);
      destinationMap.set(key, {
        name: course.destination.name,
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
  courses.forEach((course) => {
    if (course.university) {
      const key = course.university.id;
      const existing = universityMap.get(key);
      universityMap.set(key, {
        name: course.university.name,
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
    {
      id: "university",
      label: "University",
      options: universityOptions,
    },
  ];
}
