"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface BlogHeroOptimizedProps {
  destinations: Destination[];
  onFilterChange: (filters: { destination: string; search: string }) => void;
}

export function BlogHeroOptimized({
  destinations,
  onFilterChange,
}: BlogHeroOptimizedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDestination = searchParams.get("destination") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedDestination, setSelectedDestination] =
    useState(initialDestination);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Memoized filters to prevent unnecessary re-renders
  const filters = useMemo(
    () => ({
      destination: selectedDestination,
      search: searchQuery,
    }),
    [selectedDestination, searchQuery],
  );

  // Update URL when filters change (for bookmarking/sharing)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedDestination && selectedDestination !== "All") {
      params.set("destination", selectedDestination);
    }
    if (searchQuery.trim()) {
      params.set("search", searchQuery);
    }
    params.delete("page"); // Reset page on filter change

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    if (newUrl !== window.location.search) {
      router.push(newUrl, { scroll: false });
    }
  }, [filters, router]);

  // Notify parent of filter changes for immediate client-side filtering
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Sync state with URL if URL changes externally (e.g., back button)
  useEffect(() => {
    setSelectedDestination(searchParams.get("destination") || "All");
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleDestinationChange = (destinationName: string) => {
    setSelectedDestination(destinationName);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearchQuery(term);
  }, 150); // Reduced debounce for faster response

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleSearch(value);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 text-center space-y-8 relative">
      {/* Reduced animated background elements for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/4 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Explore more study guides
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover insights, tips, and stories from students worldwide
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 relative z-10">
        <button
          onClick={() => handleDestinationChange("All")}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border transform hover:scale-105 hover:shadow-lg",
            selectedDestination === "All"
              ? "bg-linear-to-r from-primary to-primary/90 text-white border-primary shadow-lg shadow-primary/25 ring-2 ring-primary/20"
              : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600 hover:bg-white hover:border-primary/30 hover:text-primary hover:shadow-primary/10 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/80",
          )}
        >
          All
        </button>
        {destinations.map((destination, index) => (
          <button
            key={destination.id}
            onClick={() => handleDestinationChange(destination.name)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border transform hover:scale-105 hover:shadow-lg",
              selectedDestination === destination.name
                ? "bg-linear-to-r from-primary to-primary/90 text-white border-primary shadow-lg shadow-primary/25 ring-2 ring-primary/20"
                : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600 hover:bg-white hover:border-primary/30 hover:text-primary hover:shadow-primary/10 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/80",
            )}
            style={{
              animationDelay: `${index * 50}ms`, // Reduced animation delay
            }}
          >
            {destination.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl px-4 relative z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-all duration-200 group-focus-within:scale-110" />
          </div>
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-16 py-4 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 text-lg placeholder-slate-400 hover:bg-white hover:shadow-md hover:border-slate-300/80 dark:hover:bg-slate-900/90 dark:hover:border-slate-600/80"
          />
          <div className="absolute inset-y-2 right-2">
            <button className="h-full aspect-square bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/25 group">
              <Search className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            </button>
          </div>
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary via-accent to-primary opacity-0 group-focus-within:opacity-20 transition-opacity duration-200 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
