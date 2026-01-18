"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  label: string;
  placeholder: string;
  options?: string[];
  dataSource?: "destinations" | "countries" | "studyLevels" | "cities" | "months" | "eventTypes";
  value: string;
  onChange: (value: string) => void;
  isMultiple?: boolean;
}

interface DynamicOption {
  id: string;
  name: string;
  slug?: string;
  flag?: string;
}

export function FilterDropdown({
  label,
  placeholder,
  options: staticOptions,
  dataSource,
  value,
  onChange,
  isMultiple = false,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<DynamicOption[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch dynamic options if dataSource is provided
  useEffect(() => {
    if (dataSource) {
      setLoading(true);
      fetch(`/api/filter-options?type=${dataSource}`)
        .then((res) => res.json())
        .then((data) => {
          setDynamicOptions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching filter options:", error);
          setLoading(false);
        });
    }
  }, [dataSource]);

  // Determine which options to use
  const options = dataSource
    ? dynamicOptions.map((opt) => opt.name)
    : staticOptions || [];

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={cn(
          "w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 transition-all duration-300 flex items-center justify-between group text-sm sm:text-base",
          "bg-white dark:bg-gray-900 shadow-sm hover:shadow-md",
          isOpen
            ? "border-primary ring-4 ring-primary/10 shadow-lg shadow-primary/5"
            : "border-gray-200 dark:border-gray-700 hover:border-primary/40",
          loading && "opacity-60 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "truncate transition-colors duration-200",
            value ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </span>
          ) : (
            value || placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-all duration-300 shrink-0 ml-2",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 mt-2 z-100",
          "transition-all duration-200 origin-top",
          isOpen && !loading
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 max-h-64 overflow-y-auto overflow-x-hidden">
          {/* Dropdown Header */}
          <div className="sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Select {label}
            </span>
          </div>
          
          {/* Options List */}
          <div className="p-1.5">
            {options.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-400 text-center">
                <span className="block text-2xl mb-2">🔍</span>
                No options available
              </div>
            ) : (
              options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left rounded-lg transition-all duration-200 text-sm font-medium",
                    "flex items-center justify-between gap-3 group/item",
                    value === option
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                  style={{
                    animationDelay: `${index * 30}ms`,
                  }}
                >
                  <span className="truncate">{option}</span>
                  {value === option && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
