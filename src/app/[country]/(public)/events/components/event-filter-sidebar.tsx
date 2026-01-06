"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  options: { label: string; value: string; count?: number }[];
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: "eventType",
    label: "Event Type",
    options: [
      { label: "Education Expo / Fair", value: "EXPO", count: 25 },
      { label: "Virtual Event / Webinar", value: "WEBINAR", count: 18 },
      {
        label: "Application / Admission Day",
        value: "ADMISSION_DAY",
        count: 12,
      },
      { label: "Spot Admission / Offer Day", value: "OPEN_DAY", count: 15 },
      { label: "Education Seminar / Workshop", value: "SEMINAR", count: 8 },
    ],
  },
  {
    id: "destination",
    label: "Study Destination",
    options: [
      { label: "United Kingdom", value: "uk", count: 45 },
      { label: "United States", value: "usa", count: 32 },
      { label: "Canada", value: "canada", count: 28 },
      { label: "Australia", value: "australia", count: 22 },
      { label: "Ireland", value: "ireland", count: 15 },
      { label: "New Zealand", value: "new-zealand", count: 10 },
    ],
  },
  {
    id: "month",
    label: "Event Month",
    options: [
      { label: "January", value: "january", count: 8 },
      { label: "February", value: "february", count: 12 },
      { label: "March", value: "march", count: 15 },
      { label: "April", value: "april", count: 10 },
      { label: "May", value: "may", count: 18 },
      { label: "June", value: "june", count: 14 },
      { label: "July", value: "july", count: 16 },
      { label: "August", value: "august", count: 12 },
      { label: "September", value: "september", count: 20 },
      { label: "October", value: "october", count: 15 },
      { label: "November", value: "november", count: 10 },
      { label: "December", value: "december", count: 8 },
    ],
  },
  {
    id: "city",
    label: "City",
    options: [
      { label: "London", value: "london", count: 12 },
      { label: "Manchester", value: "manchester", count: 8 },
      { label: "Birmingham", value: "birmingham", count: 6 },
      { label: "New York", value: "new-york", count: 10 },
      { label: "Toronto", value: "toronto", count: 9 },
      { label: "Sydney", value: "sydney", count: 7 },
      { label: "Dublin", value: "dublin", count: 5 },
    ],
  },
];

export function EventFilterSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    eventType: true,
    destination: true,
    month: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg">
        <Filter className="w-5 h-5" />
        <h2>Filters</h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {FILTER_OPTIONS.map((section) => (
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
              {openSections[section.id] ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {openSections[section.id] && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                {section.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group/option"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                    </div>
                    <span className="text-slate-600 text-sm group-hover/option:text-slate-900 transition-colors flex-1">
                      {option.label}
                    </span>
                    {option.count && (
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {option.count}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
