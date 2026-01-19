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

  const [selectedDestination, setSelectedDestination] =
    useState(initialDestination);
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
    <div className="w-full flex flex-col items-center justify-center py-10 text-center space-y-8 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-10 left-1/4 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold   tracking-tight mb-4">
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
            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border transform hover:scale-105 hover:shadow-lg",
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
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border transform hover:scale-105 hover:shadow-lg",
              selectedDestination === destination.name
                ? "bg-linear-to-r from-primary to-primary/90 text-white border-primary shadow-lg shadow-primary/25 ring-2 ring-primary/20"
                : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600 hover:bg-white hover:border-primary/30 hover:text-primary hover:shadow-primary/10 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/80",
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {destination.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl px-4 relative z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
          </div>
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-16 py-4 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 text-lg placeholder-slate-400 hover:bg-white hover:shadow-md hover:border-slate-300/80 dark:hover:bg-slate-900/90 dark:hover:border-slate-600/80"
          />
          <div className="absolute inset-y-2 right-2">
            <button className="h-full aspect-square bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/25 group">
              <Search className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary via-accent to-primary opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
