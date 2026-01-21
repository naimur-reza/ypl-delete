"use client";

import { Search, ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface BlogFilterProps {
  countries: { id: string; name: string }[];
  categories: string[];
  initialCountry?: string | null;
}

export function BlogFilter({
  countries,
  categories,
  initialCountry,
}: BlogFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = searchParams.get("category") || "All";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName === "All") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setIsDropdownOpen(false);
  };

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Category Filter Dropdown */}
      <div className="relative w-full max-w-sm" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-5 py-3 rounded-full border-2 font-semibold text-sm transition-all duration-300 shadow-md",
            isDropdownOpen
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-slate-300 bg-white hover:border-slate-400 hover:shadow-lg",
          )}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700 truncate text-sm">
              {currentCategory === "All" ? "All Blogs" : currentCategory}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-300",
              isDropdownOpen ? "rotate-180" : "",
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-xl z-[100] overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {/* All Blogs Option */}
              <button
                onClick={() => handleCategoryChange("All")}
                className={cn(
                  "w-full text-left px-5 py-3 text-sm font-semibold transition-colors duration-200",
                  currentCategory === "All"
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                All Blogs
              </button>

              {/* Category Items */}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "w-full text-left px-5 py-3 text-sm font-semibold transition-colors duration-200",
                    currentCategory === category
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Button */}
      {currentCategory !== "All" && (
        <button
          onClick={clearFilter}
          className="p-2.5 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
          aria-label="Clear filter"
        >
          <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
        </button>
      )}
    </div>
  );
}
