"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

interface BlogFilterProps {
  countries: { id: string; name: string }[];
  initialCountry?: string | null;
}

export function BlogFilter({ countries, initialCountry }: BlogFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get country from URL params - if 'all' param exists, use All; 
  // if 'country' param exists, use that; otherwise use initialCountry
  const urlCountry = searchParams.get("country");
  const isAllSelected = searchParams.has("all") || urlCountry === null && !initialCountry;
  const currentCountry = isAllSelected ? "All" : (urlCountry || initialCountry || "All");
  const currentSearch = searchParams.get("search") || "";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  const handleCountryChange = (countryName: string) => {
    const params = new URLSearchParams(searchParams);
    if (countryName === "All") {
      params.delete("country");
      params.set("all", "true"); // Explicitly mark All as selected
    } else {
      params.set("country", countryName);
      params.delete("all");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Explore more study guides
        </h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Country Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCountryChange("All")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              currentCountry === "All"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            All
          </button>
          {countries.map((country) => (
            <button
              key={country.id}
              onClick={() => handleCountryChange(country.name)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                currentCountry === country.name
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {country.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides..."
            defaultValue={currentSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
