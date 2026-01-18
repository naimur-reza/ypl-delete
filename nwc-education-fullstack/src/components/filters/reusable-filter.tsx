"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  options: { label: string; value: string; count?: number }[];
}

export interface ReusableFilterProps {
  filters: FilterOption[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (category: string, value: string) => void;
  onClearAll: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (query: string) => void;
  defaultOpenSections?: string[];
}

export function ReusableFilter({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  defaultOpenSections = [],
}: ReusableFilterProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    defaultOpenSections.reduce((acc, id) => ({ ...acc, [id]: true }), {})
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeFilterCount =
    Object.values(selectedFilters).reduce(
      (sum, values) => sum + (values?.length || 0),
      0
    ) + (searchValue.trim() ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Filter className="w-5 h-5" />
          <h2>Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Search Input */}
      {onSearchChange && (
        <div className="relative mb-8">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-6">
        {filters.map((section) => {
          const isOpen = openSections[section.id] ?? false;
          const selectedValues = selectedFilters[section.id] || [];

          return (
            <div
              key={section.id}
              className="border-b border-slate-100 pb-6 last:border-0 last:pb-0"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full text-left mb-4 group"
              >
                <span className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                  {section.label}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                  {section.options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group/option"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              onFilterChange(section.id, option.value)
                            }
                            className="peer h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                          />
                        </div>
                        <span
                          className={cn(
                            "text-sm transition-colors flex-1",
                            isSelected
                              ? "text-slate-900 font-medium"
                              : "text-slate-600 group-hover/option:text-slate-900"
                          )}
                        >
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {option.count}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
