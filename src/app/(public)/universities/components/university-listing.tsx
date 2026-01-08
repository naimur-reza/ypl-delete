"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Pagination } from "@/components/ui/pagination";
import { UniversityCard } from "./university-card";
import { ReusableFilter } from "@/components/filters/reusable-filter";
import {
  extractUniversityFilterOptions,
  extractCity,
} from "@/lib/university-filters";
import { useFilter } from "@/hooks/use-filter";
import {
  University,
  ProviderType,
} from "../../../../../prisma/src/generated/prisma/client";

const ITEMS_PER_PAGE = 9;

interface UniversityListingProps {
  universities: Array<
    University & {
      destination?: { id: string; name: string } | null;
      scholarships?: Array<{ id: string }>;
    }
  >;
}

export function UniversityListing({ universities }: UniversityListingProps) {
  const [currentPage, setCurrentPage] = useState(1);

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
      providerType: {
        getValue: (uni) => uni.providerType,
        matchType: "exact",
      },
      city: {
        getValue: (uni) => extractCity(uni.address),
        matchType: "exact",
      },
      special: {
        getValue: (uni) => {
          const specials: string[] = [];
          if (uni.isFeatured) specials.push("featured");
          if (uni.scholarships && uni.scholarships.length > 0)
            specials.push("hasScholarships");
          return specials;
        },
        matchType: "array",
      },
    },
    searchFields: [
      (uni) => uni.name,
      (uni) => uni.description,
      (uni) => uni.address,
    ],
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [filters, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <section className="py-12 px-4 md:px-8 bg-slate-50">
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
              defaultOpenSections={["destination", "providerType"]}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length}{" "}
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

            {paginatedData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginatedData.map((uni) => (
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={filteredData.length}
              itemName="universities"
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
