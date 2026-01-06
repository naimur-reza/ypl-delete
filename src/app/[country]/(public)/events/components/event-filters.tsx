"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

interface EventFiltersProps {
  onFilterChange?: (filters: any) => void;
}

const EVENT_TYPES = [
  { label: "Education Expo / Fair", value: "EXPO" },
  { label: "Virtual Event / Webinar", value: "WEBINAR" },
  { label: "Application / Admission Day", value: "ADMISSION_DAY" },
  { label: "Spot Admission / Offer Day", value: "OPEN_DAY" },
  { label: "University Open Day", value: "OPEN_DAY" },
  { label: "Education Seminar / Workshop", value: "SEMINAR" },
];

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Ireland",
  "New Zealand",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    eventTypes: [] as string[],
    countries: [] as string[],
    months: [] as string[],
  });

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter((v) => v !== value);
      } else {
        updated[category] = [...updated[category], value];
      }
      return updated;
    });
  };

  const clearFilters = () => {
    setSelectedFilters({ eventTypes: [], countries: [], months: [] });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-slate-900">Filter Events</h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 text-primary font-semibold"
        >
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
        <button
          onClick={clearFilters}
          className="hidden md:block text-sm text-slate-500 hover:text-primary transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className={`grid md:grid-cols-3 gap-6 ${showFilters ? 'block' : 'hidden md:grid'}`}>
        {/* Event Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Event Type</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {EVENT_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFilters.eventTypes.includes(type.value)}
                  onChange={() => toggleFilter('eventTypes', type.value)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Event Destination Country */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Destination Country</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {COUNTRIES.map((country) => (
              <label key={country} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFilters.countries.includes(country)}
                  onChange={() => toggleFilter('countries', country)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {country}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Event Month */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Event Month</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {MONTHS.map((month) => (
              <label key={month} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFilters.months.includes(month)}
                  onChange={() => toggleFilter('months', month)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {month}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedFilters.eventTypes.length > 0 || selectedFilters.countries.length > 0 || selectedFilters.months.length > 0) && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap gap-2">
            {[...selectedFilters.eventTypes, ...selectedFilters.countries, ...selectedFilters.months].map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
              >
                {EVENT_TYPES.find(t => t.value === filter)?.label || filter}
                <button
                  onClick={() => {
                    if (selectedFilters.eventTypes.includes(filter)) toggleFilter('eventTypes', filter);
                    if (selectedFilters.countries.includes(filter)) toggleFilter('countries', filter);
                    if (selectedFilters.months.includes(filter)) toggleFilter('months', filter);
                  }}
                  className="hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
