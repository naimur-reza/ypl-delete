"use client";

import { useMemo } from "react";

import { UniversityCard } from "./university-card";
import { ReusableFilter } from "@/components/filters/reusable-filter";
import { extractUniversityFilterOptions } from "@/lib/university-filters";
import { useFilter } from "@/hooks/use-filter";
import { University } from "../../../../../../prisma/src/generated/prisma/client";

interface UniversityListingProps {
  universities: Array<
    University & { destination?: { id: string; name: string } | null }
  >;
}

export function UniversityListing({ universities }: UniversityListingProps) {
  const filterOptions = useMemo(
    () => extractUniversityFilterOptions(universities),
    [universities]
  );

  const {
    filters,
    searchQuery,
    filteredData,
    toggleFilter,
    clearFilters,
    setSearchQuery,
  } = useFilter({
    data: universities,
    filterConfig: {
      destination: {
        getValue: (uni) => uni.destination?.id,
        matchType: "exact",
      },
    },
    searchFields: [
      (uni) => uni.name,
      (uni) => uni.description,
      (uni) => uni.address,
    ],
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
              searchPlaceholder="Search universities..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              defaultOpenSections={["destination"]}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Showing {filteredData.length}{" "}
                {filteredData.length === 1 ? "University" : "Universities"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Popularity</option>
                  <option>Ranking</option>
                  <option>Name (A-Z)</option>
                </select>
              </div>
            </div>

            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map((uni) => (
                  <UniversityCard key={uni.id} university={uni} />
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-lg">No universities found.</p>
                <p className="text-slate-400 text-sm mt-2">
                  {Object.keys(filters).length > 0 || searchQuery
                    ? "Try adjusting your filters or search query."
                    : "Check back later for new universities."}
                </p>
              </div>
            )}

            {/* Pagination Mockup */}
            {filteredData.length > 0 && (
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
