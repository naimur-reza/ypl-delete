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
    id: "country",
    label: "Country",
    options: [
      { label: "United Kingdom", value: "uk", count: 120 },
      { label: "USA", value: "usa", count: 85 },
      { label: "Canada", value: "canada", count: 45 },
      { label: "Australia", value: "australia", count: 32 },
      { label: "Ireland", value: "ireland", count: 15 },
    ],
  },
  {
    id: "level",
    label: "Level of Study",
    options: [
      { label: "Undergraduate", value: "ug", count: 250 },
      { label: "Postgraduate", value: "pg", count: 180 },
      { label: "PhD / Doctorate", value: "phd", count: 40 },
      { label: "Foundation", value: "foundation", count: 60 },
    ],
  },
  {
    id: "tuition",
    label: "Tuition Fee Range",
    options: [
      { label: "Under $10,000", value: "0-10000" },
      { label: "$10,000 - $20,000", value: "10000-20000" },
      { label: "$20,000 - $30,000", value: "20000-30000" },
      { label: "$30,000+", value: "30000+" },
    ],
  },
  {
    id: "subject",
    label: "Subject / Course",
    options: [
      { label: "Business & Management", value: "business", count: 150 },
      { label: "Computer Science", value: "cs", count: 120 },
      { label: "Engineering", value: "engineering", count: 100 },
      { label: "Medicine & Health", value: "medicine", count: 80 },
      { label: "Arts & Design", value: "arts", count: 60 },
    ],
  },
  {
    id: "scholarship",
    label: "Scholarship",
    options: [
      { label: "Available", value: "available", count: 200 },
      { label: "Fully Funded", value: "fully-funded", count: 20 },
      { label: "Partially Funded", value: "partially-funded", count: 180 },
    ],
  },
  {
    id: "intake",
    label: "Intakes",
    options: [
      { label: "January 2026", value: "jan-2026" },
      { label: "May 2026", value: "may-2026" },
      { label: "September 2026", value: "sep-2026" },
    ],
  },
  {
    id: "ranking",
    label: "Ranking",
    options: [
      { label: "Top 100", value: "top-100" },
      { label: "Top 500", value: "top-500" },
      { label: "Top 1000", value: "top-1000" },
    ],
  },
];

export function FilterSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    country: true,
    level: true,
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
          placeholder="Search universities..."
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {FILTER_OPTIONS.map((section) => (
          <div key={section.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
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
