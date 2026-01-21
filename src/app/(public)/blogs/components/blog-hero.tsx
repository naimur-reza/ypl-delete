"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface BlogHeroProps {
  destinations: Destination[];
  categories?: string[];
}

export function BlogHero({ destinations, categories = [] }: BlogHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initialDestination = searchParams.get("destination") || "All";
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [selectedDestination, setSelectedDestination] =
    useState(initialDestination);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

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

  // Sync state with URL if URL changes externally (e.g back button)
  useEffect(() => {
    setSelectedDestination(searchParams.get("destination") || "All");
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page to 1 on filter change
    params.delete("page");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleDestinationChange = (destinationName: string) => {
    setSelectedDestination(destinationName);
    updateUrl("destination", destinationName);
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    updateUrl("category", categoryName);
    setIsDropdownOpen(false);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateUrl("search", term);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleSearch(value);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-16 md:py-20 text-center space-y-10 relative">
      {/* Main content */}
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
          Explore more study guides
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Discover insights, tips, and stories from students worldwide
        </p>
      </div>

      {/* Destination buttons */}
      <div className="flex flex-wrap justify-center gap-3 relative z-10">
        <button
          onClick={() => handleDestinationChange("All")}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border transform hover:scale-105 hover:shadow-md",
            selectedDestination === "All"
              ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20"
              : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600",
          )}
        >
          All
        </button>
        {destinations.map((destination) => (
          <button
            key={destination.id}
            onClick={() => handleDestinationChange(destination.name)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border transform hover:scale-105 hover:shadow-md",
              selectedDestination === destination.name
                ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20"
                : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600",
            )}
          >
            {destination.name}
          </button>
        ))}
      </div>

      {/* Search and Filter section */}
      <div
        className="w-full max-w-5xl px-4 z-10"
        style={{ overflow: "visible" }}
      >
        <div
          className="flex gap-3 flex-col sm:flex-row items-stretch"
          style={{ overflow: "visible" }}
        >
          {/* Search bar */}
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-base placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Category Filter Dropdown */}
          <div
            className="relative w-full sm:w-80"
            ref={dropdownRef}
            style={{ overflow: "visible" }}
          >
            <button
              onClick={() => {
                if (dropdownRef.current) {
                  const rect = dropdownRef.current.getBoundingClientRect();
                  setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left,
                    width: rect.width,
                  });
                }
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-5 py-4 rounded-full border-2 font-semibold text-sm transition-all duration-300 shadow-md",
                isDropdownOpen
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg"
                  : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-lg",
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 truncate text-sm">
                  {selectedCategory === "All" ? "All Blogs" : selectedCategory}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 shrink-0 text-slate-400 transition-transform duration-300",
                  isDropdownOpen ? "rotate-180" : "",
                )}
              />
            </button>

            {/* Dropdown Menu - Using fixed positioning to escape constraints */}
            {isDropdownOpen && (
              <div
                className="fixed bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl z-50"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                  maxHeight: "320px",
                  overflow: "hidden",
                }}
              >
                <div className="max-h-80 overflow-y-auto overflow-x-hidden">
                  {/* All Blogs Option */}
                  <button
                    onClick={() => handleCategoryChange("All")}
                    className={cn(
                      "w-full text-left px-5 py-3 text-sm font-semibold transition-colors duration-200",
                      selectedCategory === "All"
                        ? "bg-red-500 text-white"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    All Blogs
                  </button>

                  {/* Category Items */}
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={cn(
                          "w-full text-left px-5 py-3 text-sm font-semibold transition-colors duration-200",
                          selectedCategory === category
                            ? "bg-red-500 text-white"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                        )}
                      >
                        {category}
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">
                      No categories available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
