"use client";

import type React from "react";

import { useState } from "react";

import { FilterDropdown } from "./filter-dropdown";
import { SearchInputWithSuggestions } from "./search-input-with-suggestions";
import { FilterTabType, getFilterConfig } from "@/lib/filter-config";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountryAwareLink } from "../common/navbar/country-aware-link";

interface FilterContentProps {
  activeTab: FilterTabType;
  onSearch: (value: string) => void;
  onOpenWizard?: () => void;
}

export function FilterContent({
  activeTab,
  onSearch,
  onOpenWizard,
}: FilterContentProps) {
  const config = getFilterConfig(activeTab);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleSearch = () => {
    // Combine all filter values and pass to onSearch
    const searchQuery = Object.entries(filterValues)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    onSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  if (activeTab === "Guide" && onOpenWizard) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 sm:gap-8 shadow-xl border border-purple-200/30 dark:border-purple-800/20 backdrop-blur-sm overflow-hidden">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <span className="text-3xl font-bold text-primary">nwc-ai</span>
              <span className="text-primary text-xl">⭐</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl text-base md:text-lg leading-relaxed">
              Use our magical AI system, to find courses with high admission
              chances.
            </p>
            <button
              onClick={onOpenWizard}
              className={cn(
                "px-8 py-4 rounded-xl font-bold text-base transition-all duration-300",
                "bg-gray-900 dark:bg-gray-800 text-white shadow-lg",
                "hover:shadow-2xl hover:scale-105 active:scale-95",
                "border-2 border-gray-800 dark:border-gray-700"
              )}
            >
              Try now
            </button>
          </div>
          <div className="relative w-64 h-64 shrink-0 hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Person illustration */}
                <circle cx="100" cy="80" r="25" fill="#9333ea" />
                <rect
                  x="85"
                  y="105"
                  width="30"
                  height="40"
                  rx="5"
                  fill="#9333ea"
                />
                <rect
                  x="75"
                  y="120"
                  width="15"
                  height="25"
                  rx="3"
                  fill="#9333ea"
                />
                <rect
                  x="110"
                  y="120"
                  width="15"
                  height="25"
                  rx="3"
                  fill="#9333ea"
                />
                <rect
                  x="90"
                  y="145"
                  width="10"
                  height="20"
                  rx="2"
                  fill="#9333ea"
                />
                <rect
                  x="100"
                  y="145"
                  width="10"
                  height="20"
                  rx="2"
                  fill="#9333ea"
                />
                {/* Puzzle pieces */}
                <rect
                  x="40"
                  y="60"
                  width="20"
                  height="20"
                  rx="3"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
                <rect
                  x="40"
                  y="85"
                  width="20"
                  height="20"
                  rx="3"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
                <rect
                  x="40"
                  y="110"
                  width="20"
                  height="20"
                  rx="3"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
                {/* Puzzle pieces in hands */}
                <rect
                  x="70"
                  y="100"
                  width="15"
                  height="15"
                  rx="2"
                  fill="#9333ea"
                />
                <rect
                  x="115"
                  y="100"
                  width="15"
                  height="15"
                  rx="2"
                  fill="#9333ea"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Special layout for "Get instant offer" tab
  if (config.showAsCard) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-linear-to-r from-yellow-50 via-green-50 to-blue-50 dark:from-yellow-900/10 dark:via-green-900/10 dark:to-blue-900/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-xl border border-yellow-200/30 dark:border-yellow-800/20 backdrop-blur-sm">
          <div className="relative w-56 h-56 shrink-0">
            <div className="absolute inset-0 bg-linear-to-br from-green-400 via-blue-500 to-primary rounded-full shadow-2xl animate-pulse" />
            <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-7xl">👩‍🎓</span>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full opacity-80 animate-bounce" />
            <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-blue-400 rounded-full opacity-80 animate-bounce delay-100" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 leading-tight">
              Get ready for the FastLane
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl text-base md:text-lg leading-relaxed">
              Make your university application stress free and discover in
              minutes if you&apos;d get into the university you&apos;ve always
              dreamed of.
            </p>
<CountryAwareLink href="/apply-now">
              <button
              onClick={handleSearch}
              className={cn(
                "px-10 py-4 rounded-xl font-bold text-base transition-all duration-300",
                "bg-linear-to-r from-blue-600 via-blue-700 to-purple-700 cursor-pointer text-white shadow-lg shadow-blue-600/30",
                "hover:shadow-2xl hover:shadow-blue-600/50 hover:scale-105 active:scale-95",
                "border-2 border-blue-500/50 relative overflow-hidden group"
              )}
            >
              <span className="relative z-10">Get started</span>
              <div className="absolute inset-0 bg-linear-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
</CountryAwareLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4">
        {/* Dynamic Filter Fields - All visible on mobile */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:items-end">
          {config.filters.map((filter) => {
            if (filter.type === "input") {
              return (
                <div
                  key={filter.id}
                  className="flex-1 min-w-0 md:min-w-[200px]"
                >
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2.5 ml-1">
                    {filter.label}
                  </label>
                  {filter.suggestionType ? (
                    <SearchInputWithSuggestions
                      value={filterValues[filter.id] || ""}
                      onChange={(value) => handleFilterChange(filter.id, value)}
                      onKeyDown={handleKeyDown}
                      placeholder={filter.placeholder}
                      suggestionType={filter.suggestionType}
                      onSuggestionSelect={(suggestion) => {
                        handleFilterChange(filter.id, suggestion.name);
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={filterValues[filter.id] || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.id, e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      placeholder={filter.placeholder}
                      className={cn(
                        "w-full px-3 md:px-4 py-3 md:py-3.5 rounded-lg border transition-all duration-300 text-sm",
                        "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
                        "border-gray-300 dark:border-gray-600"
                      )}
                    />
                  )}
                </div>
              );
            } else {
              return (
                <div
                  key={filter.id}
                  className="flex-1 min-w-0 md:min-w-[200px]"
                >
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2.5 ml-1">
                    {filter.label}
                  </label>
                  <FilterDropdown
                    label={filter.label}
                    placeholder={filter.placeholder}
                    options={filter.options}
                    dataSource={filter.dataSource}
                    value={filterValues[filter.id] || ""}
                    onChange={(value) => handleFilterChange(filter.id, value)}
                    isMultiple={filter.multiple}
                  />
                </div>
              );
            }
          })}

          {/* Search Button - Desktop only, inline with filters */}
          {config.hasSearchButton && (
            <div className="hidden md:block shrink-0">
              <button
                onClick={handleSearch}
                className={cn(
                  "w-auto px-8 py-3.5 rounded-xl font-bold transition-all duration-300",
                  "bg-primary text-white shadow-lg shadow-primary/25",
                  "hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] hover:-translate-y-0.5",
                  "flex items-center justify-center gap-2.5 whitespace-nowrap active:scale-[0.98] cursor-pointer"
                )}
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile: Full-width gradient search button */}
        {config.hasSearchButton && (
          <button
            onClick={handleSearch}
            className={cn(
              "md:hidden w-full py-3.5 rounded-lg font-bold text-sm transition-all duration-300",
              "bg-linear-to-r from-primary via-primary to-accent text-white",
              "shadow-lg shadow-primary/30 active:scale-[0.98]",
              "flex items-center justify-center gap-2"
            )}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        )}
      </div>
    </div>
  );
}
