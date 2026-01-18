import { FilterOption } from "@/components/filters/reusable-filter";
import { ProviderType } from "../../prisma/src/generated/prisma/client";

interface University {
  id: string;
  name: string;
  address?: string | null;
  providerType?: ProviderType;
  isFeatured?: boolean;
  destination?: {
    id: string;
    name: string;
  } | null;
  scholarships?: Array<{ id: string }>;
}

// Human-readable labels for provider types
const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  UNIVERSITY: "University",
  GOVERNMENT: "Government Institution",
  PRIVATE: "Private Institution",
  EMBASSY: "Embassy",
};

// Extract city from address string
function extractCity(address: string | null | undefined): string | null {
  if (!address) return null;

  // Try to extract city - usually before the country or at end
  // Common patterns: "City, State, Country" or "Street, City, Country"
  const parts = address.split(",").map((p) => p.trim());

  if (parts.length >= 2) {
    // Return second-to-last part (usually city)
    return parts[parts.length - 2];
  }

  return null;
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

  // Extract provider types with counts
  const providerTypeMap = new Map<string, number>();
  universities.forEach((uni) => {
    if (uni.providerType) {
      const count = providerTypeMap.get(uni.providerType) || 0;
      providerTypeMap.set(uni.providerType, count + 1);
    }
  });

  const providerTypeOrder: ProviderType[] = [
    "UNIVERSITY",
    "PRIVATE",
    "GOVERNMENT",
    "EMBASSY",
  ];
  const providerTypeOptions = providerTypeOrder
    .filter((type) => providerTypeMap.has(type))
    .map((type) => ({
      label: PROVIDER_TYPE_LABELS[type],
      value: type,
      count: providerTypeMap.get(type) || 0,
    }));

  // Extract cities with counts (top 20)
  // const cityMap = new Map<string, number>();
  // universities.forEach((uni) => {
  //   const city = extractCity(uni.address);
  //   if (city && city.length > 1) {
  //     const count = cityMap.get(city) || 0;
  //     cityMap.set(city, count + 1);
  //   }
  // });

  // const cityOptions = Array.from(cityMap.entries())
  //   .map(([value, count]) => ({
  //     label: value,
  //     value,
  //     count,
  //   }))
  //   .sort((a, b) => b.count - a.count)
  //   .slice(0, 20);

  // Extract featured filter
  const featuredCount = universities.filter((u) => u.isFeatured).length;
  const hasScholarshipsCount = universities.filter(
    (u) => u.scholarships && u.scholarships.length > 0
  ).length;

  // Build filter options array - only include sections with options
  const filters: FilterOption[] = [];

  if (destinationOptions.length > 0) {
    filters.push({
      id: "destination",
      label: "Study Destination",
      options: destinationOptions,
    });
  }

  if (providerTypeOptions.length > 0) {
    filters.push({
      id: "providerType",
      label: "Institution Type",
      options: providerTypeOptions,
    });
  }

  // if (cityOptions.length > 0) {
  //   filters.push({
  //     id: "city",
  //     label: "City",
  //     options: cityOptions,
  //   });
  // }

  // Add featured and scholarship filters
  const specialOptions: FilterOption["options"] = [];
  if (featuredCount > 0) {
    specialOptions.push({
      label: "Featured Universities",
      value: "featured",
      count: featuredCount,
    });
  }
  if (hasScholarshipsCount > 0) {
    specialOptions.push({
      label: "With Scholarships",
      value: "hasScholarships",
      count: hasScholarshipsCount,
    });
  }

  if (specialOptions.length > 0) {
    filters.push({
      id: "special",
      label: "Quick Filters",
      options: specialOptions,
    });
  }

  return filters;
}

// Export utilities for use in other components
export { PROVIDER_TYPE_LABELS, extractCity };
