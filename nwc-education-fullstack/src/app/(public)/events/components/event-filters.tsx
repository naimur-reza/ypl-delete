"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

interface EventFiltersProps {
  onFilterChange?: (filters: EventFilterState) => void;
  cities?: string[];
}

export interface EventFilterState {
  eventTypes: string[];
  countries: string[];
  cities: string[];
}

const EVENT_TYPES = [
  { label: "Education Expo / Fair", value: "EXPO" },
  { label: "Virtual Event / Webinar", value: "WEBINAR" },
  { label: "Application / Admission Day", value: "ADMISSION_DAY" },
  { label: "Spot Admission / Offer Day", value: "SPOT_ADMISSION" },
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

export function EventFilters({ onFilterChange, cities = [] }: EventFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<EventFilterState>({
    eventTypes: [],
    countries: [],
    cities: [],
  });

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange?.(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const toggleFilter = (category: keyof EventFilterState, value: string) => {
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
    setSelectedFilters({ eventTypes: [], countries: [], cities: [] });
  };

  const hasActiveFilters = 
    selectedFilters.eventTypes.length > 0 || 
    selectedFilters.countries.length > 0 || 
    selectedFilters.cities.length > 0;

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

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Country</label>
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

        {/* City Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">City</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cities.length > 0 ? (
              cities.map((city) => (
                <label key={city} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedFilters.cities.includes(city)}
                    onChange={() => toggleFilter('cities', city)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    {city}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No cities available</p>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap gap-2">
            {[...selectedFilters.eventTypes, ...selectedFilters.countries, ...selectedFilters.cities].map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
              >
                {EVENT_TYPES.find(t => t.value === filter)?.label || filter}
                <button
                  onClick={() => {
                    if (selectedFilters.eventTypes.includes(filter)) toggleFilter('eventTypes', filter);
                    if (selectedFilters.countries.includes(filter)) toggleFilter('countries', filter);
                    if (selectedFilters.cities.includes(filter)) toggleFilter('cities', filter);
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
