"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

interface EssentialStudyItem {
  id: string;
  title: string;
  description: string | null;
  slug: string;
}

interface EssentialStudyClientProps {
  essentials: EssentialStudyItem[];
  destinationSlug: string;
  countryName: string;
}

const ITEMS_PER_PAGE = 5;

export function EssentialStudyClient({ 
  essentials, 
  destinationSlug, 
  countryName 
}: EssentialStudyClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filter essentials based on search query
  const filteredEssentials = useMemo(() => {
    if (!searchQuery.trim()) return essentials;
    
    const query = searchQuery.toLowerCase();
    return essentials.filter(item => 
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  }, [essentials, searchQuery]);

  // Get visible items based on load more state
  const visibleEssentials = filteredEssentials.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEssentials.length;

  // Reset visible count when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setVisibleCount(ITEMS_PER_PAGE); // Reset to initial count on new search
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  // Fallback data if no essentials exist
  const displayEssentials = visibleEssentials.length > 0 ? visibleEssentials  : []

  const showFallback = essentials.length === 0;

  return (
    <section className="py-14 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-8 font-serif">
            Essential study information <br />
            for your journey abroad
          </h2>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Enter keywords"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-6 pr-16 py-4 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-slate-600"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md px-4 flex items-center justify-center transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results Info */}
          {searchQuery && !showFallback && (
            <p className="text-slate-500 mt-4 text-sm">
              Found {filteredEssentials.length} result{filteredEssentials.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
            </p>
          )}
        </div>

        {/* List Items */}
        <div className="space-y-0 divide-y divide-slate-200 border-t border-b border-slate-200">
          {displayEssentials.map((item) => (
            <div key={item.id} className="py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-bold text-secondary mb-3 font-serif group-hover:text-secondary/80 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>
              <div className="shrink-0">
                <CountryAwareLink
                  href={`/study-abroad/${destinationSlug}/${item.slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg min-w-[140px]"
                >
                  Learn more
                </CountryAwareLink>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredEssentials.length === 0 && searchQuery && !showFallback && (
          <div className="text-center py-12">
            <p className="text-slate-500">No results found for &quot;{searchQuery}&quot;</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-primary hover:underline mt-2 text-sm"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Load More */}
        {!showFallback && hasMore && (
          <div className="mt-12 text-center">
            <GradientButton 
              className="px-8 py-3"
              onClick={loadMore}
            >
              Load More &gt;
            </GradientButton>
          </div>
        )}

        {/* Show count info when items are loaded */}
        {!showFallback && filteredEssentials.length > 0 && (
          <div className="mt-4 text-center text-sm text-slate-500">
            Showing {Math.min(visibleCount, filteredEssentials.length)} of {filteredEssentials.length} items
          </div>
        )}
      </div>
    </section>
  );
}
