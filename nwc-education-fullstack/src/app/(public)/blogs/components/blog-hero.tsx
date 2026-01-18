"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface BlogHeroProps {
  destinations: Destination[];
}

export function BlogHero({ destinations }: BlogHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialDestination = searchParams.get("destination") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Sync state with URL if URL changes externally (e.g. back button)
  useEffect(() => {
    setSelectedDestination(searchParams.get("destination") || "All");
    setSearchQuery(searchParams.get("search") || "");
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

  const handleSearch = useDebouncedCallback((term: string) => {
    updateUrl("search", term);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleSearch(value);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 md:py-20 text-center space-y-8">
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
        Explore more study guides
      </h1>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => handleDestinationChange("All")}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
            selectedDestination === "All"
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          )}
        >
          All
        </button>
        {destinations.map((destination) => (
          <button
            key={destination.id}
            onClick={() => handleDestinationChange(destination.name)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
              selectedDestination === destination.name
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            {destination.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
          />
          <div className="absolute inset-y-2 right-2">
             <button className="h-full aspect-square bg-blue-700 hover:bg-blue-800 text-white rounded-xl flex items-center justify-center transition-colors">
                <Search className="h-5 w-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
