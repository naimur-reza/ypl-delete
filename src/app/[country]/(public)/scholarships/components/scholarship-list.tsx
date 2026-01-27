"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Clock,
  ArrowRight,
  Banknote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { ReusableFilter } from "@/components/filters/reusable-filter";
import {
  extractScholarshipFilterOptions,
  parseAmountCategory,
  parseDeadlineStatus,
} from "@/lib/scholarship-filters";
import { useFilter } from "@/hooks/use-filter";
import { cn } from "@/lib/utils";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

interface Scholarship {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  amount?: number | null;
  deadline?: string | null;
  destination?: {
    id: string;
    name: string;
  } | null;
  university?: {
    id: string;
    name: string;
  } | null;
}

interface ScholarshipListProps {
  scholarships: Scholarship[];
  itemsPerPage?: number;
}

export default function ScholarshipList({
  scholarships,
  itemsPerPage = 9,
}: ScholarshipListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = useMemo(
    () => extractScholarshipFilterOptions(scholarships),
    [scholarships],
  );

  const {
    filters,
    searchQuery,
    filteredData,
    toggleFilter,
    clearFilters,
    setSearchQuery,
  } = useFilter({
    data: scholarships,
    filterConfig: {
      destination: {
        getValue: (scholarship) => scholarship.destination?.id,
        matchType: "exact",
      },
      university: {
        getValue: (scholarship) => scholarship.university?.id,
        matchType: "exact",
      },
      amount: {
        getValue: (scholarship) => parseAmountCategory(scholarship.amount),
        matchType: "exact",
      },
      deadline: {
        getValue: (scholarship) => parseDeadlineStatus(scholarship.deadline),
        matchType: "exact",
      },
    },
    searchFields: [
      (scholarship) => scholarship.title,
      (scholarship) => scholarship.description,
    ],
  });

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  // Pagination calculations
  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatAmount = (amount: number | null | undefined) => {
    if (!amount) return "Amount not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDeadline = (deadline: string | null | undefined) => {
    if (!deadline) return "Rolling";
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return deadline;
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to the top of the scholarship list
    document
      .getElementById("#scholarships")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section
      id="#scholarships"
      className="py-12 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24">
            <ReusableFilter
              filters={filterOptions}
              selectedFilters={filters}
              onFilterChange={toggleFilter}
              onClearAll={clearFilters}
              searchPlaceholder="Search scholarships..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              defaultOpenSections={["destination", "university"]}
            />
          </aside>

          {/* Main List Content */}
          <div className="flex-1 w-full min-w-0">
            {/* List Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                All Scholarships{" "}
                <span className="text-slate-400 font-medium text-lg ml-2">
                  ({totalCount})
                </span>
              </h2>
            </div>

            {/* List Grid */}
            {paginatedData.length > 0 ? (
              <div className="space-y-4">
                {paginatedData.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="group bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-xs hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Accent Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {scholarship.destination && (
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {scholarship.destination.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                        {scholarship.title}
                      </h3>
                      {scholarship.university && (
                        <p className="text-slate-500 font-medium mb-4">
                          {scholarship.university.name}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                        {scholarship.amount && (
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-slate-900">
                              {formatAmount(scholarship.amount)}
                            </span>
                          </div>
                        )}
                        {scholarship.deadline && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>
                              Deadline:{" "}
                              <span className="text-slate-900 font-medium">
                                {formatDeadline(scholarship.deadline)}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end md:border-l md:border-slate-100 md:pl-6">
                      <CountryAwareLink
                        href={`/scholarships/${scholarship.slug}`}
                        className="w-full md:w-auto px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </CountryAwareLink>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500 text-lg">No scholarships found.</p>
                <p className="text-slate-400 text-sm mt-2">
                  {Object.keys(filters).length > 0 || searchQuery
                    ? "Try adjusting your filters or search query."
                    : "Check back later for new scholarships."}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
                <p className="text-sm text-slate-500">
                  Showing page{" "}
                  <span className="font-medium text-slate-700">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">
                    {totalPages}
                  </span>{" "}
                  <span className="text-slate-400">
                    ({totalCount} scholarships)
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors",
                      currentPage === 1
                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, idx) =>
                      typeof page === "string" ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-slate-400"
                        >
                          {page}
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={cn(
                            "w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors",
                            currentPage === page
                              ? "bg-primary text-white"
                              : "text-slate-600 hover:bg-slate-100",
                          )}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <span className="sm:hidden text-sm text-slate-600">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors",
                      currentPage === totalPages
                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
                    )}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
