"use client";

import { useState } from "react";
import { Filter, X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Filter Options Config
const filterOptions = {
  country: ["United Kingdom", "USA", "Canada", "Australia", "New Zealand"],
  level: ["Foundation", "Undergraduate", "Postgraduate", "PhD"],
  type: ["Fully Funded", "Partial Funding", "Tuition Fee Discount", "Stipend Only"],
  intake: ["Jan 2025", "May 2025", "Sep 2025", "Jan 2026"],
  ielts: ["No IELTS Required", "5.5 - 6.0", "6.0 - 6.5", "6.5 - 7.0", "7.0+"],
  provider: ["University", "Government", "Private", "Embassy"],
};

export default function ScholarshipFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => setActiveFilters({});

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-slate-200 p-4 rounded-xl text-slate-700 font-semibold shadow-xs mb-6 hover:bg-slate-50 transition-colors"
      >
        <Filter className="w-5 h-5" />
        Filter Scholarships
      </button>

      {/* Filter Sidebar */}
      <div 
        className={cn(
          "fixed inset-0 z-50 lg:static lg:z-auto bg-black/50 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none transition-all duration-300 lg:block",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible lg:opacity-100 lg:visible"
        )}
        onClick={() => setIsOpen(false)}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute inset-y-0 left-0 w-[280px] sm:w-[320px] lg:w-full bg-white lg:bg-transparent shadow-2xl lg:shadow-none p-6 lg:p-0 overflow-y-auto transform transition-transform duration-300 ease-in-out lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 lg:hidden">
            <h3 className="text-xl font-bold text-slate-900">Filters</h3>
            <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="space-y-8 pr-2">
            
            {/* Active Filters Summary (Optional - good UX) */}
            {Object.keys(activeFilters).some(k => activeFilters[k].length > 0) && (
                 <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-900">Active Filters</span>
                        <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 font-medium">Clear All</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(activeFilters).map(([cat, vals]) => 
                            vals.map(val => (
                                <span key={`${cat}-${val}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">
                                    {val}
                                    <button onClick={() => toggleFilter(cat, val)}><X className="w-3 h-3 hover:text-blue-900" /></button>
                                </span>
                            ))
                        )}
                    </div>
                 </div>
            )}


            {/* Filter Groups */}
            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category} className="group">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  {/* <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" /> */}
                </h4>
                <div className="space-y-2.5">
                  {options.map((option) => {
                    const isSelected = activeFilters[category]?.includes(option);
                    return (
                        <label 
                            key={option} 
                            className={cn(
                                "flex items-start gap-3 cursor-pointer group/item py-1.5 px-2 rounded-lg transition-all duration-200",
                                isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                            )}
                        >
                        <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                            isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white group-hover/item:border-blue-400"
                        )}>
                             <input 
                                type="checkbox" 
                                className="hidden"
                                checked={isSelected}
                                onChange={() => toggleFilter(category, option)}
                             />
                             {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                        </div>
                        <span className={cn(
                            "text-sm font-medium transition-colors",
                            isSelected ? "text-blue-700" : "text-slate-600 group-hover/item:text-slate-900"
                        )}>
                            {option}
                        </span>
                        </label>
                    );
                  })}
                </div>
                <div className="mt-6 border-b border-slate-100 lg:hidden" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
