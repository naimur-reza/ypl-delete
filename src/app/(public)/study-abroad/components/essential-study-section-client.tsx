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

interface EssentialStudySectionClientProps {
  essentials: EssentialStudyItem[];
  countryName: string;
  destinationSlug: string;
}

export function EssentialStudySectionClient({
  essentials,
  countryName,
  destinationSlug,
}: EssentialStudySectionClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Filter items based on search query
  const filteredEssentials = useMemo(() => {
    if (!searchQuery.trim()) return essentials;

    const query = searchQuery.toLowerCase();
    return essentials.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)),
    );
  }, [essentials, searchQuery]);

  // Determine how many items to show
  const displayItems = showAll
    ? filteredEssentials
    : filteredEssentials.slice(0, 5);
  const hasMoreItems = filteredEssentials.length > 5;

  const handleLoadMore = () => {
    setShowAll(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Reset showAll when searching to show only 5 results initially
    setShowAll(false);
  };

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
              onChange={handleSearch}
              className="w-full pl-6 pr-16 py-4 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-slate-600"
            />
            <button
              className="absolute right-2 top-2 bottom-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md px-4 flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results Count */}
          {searchQuery && (
            <p className="mt-4 text-sm text-slate-600">
              Found {filteredEssentials.length} result
              {filteredEssentials.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* List Items */}
        <div className="space-y-0 divide-y divide-slate-200 border-t border-b border-slate-200">
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <div
                key={item.id}
                className="py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-bold text-secondary mb-3 font-serif group-hover:text-secondary/80 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    {item.description || "No description available"}
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
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-slate-600">
                No essential study information found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!showAll && hasMoreItems && (
          <div className="mt-12 text-center">
            <GradientButton onClick={handleLoadMore} className="px-8 py-3">
              Load More →
            </GradientButton>
          </div>
        )}

        {/* Show Less Button (when showing all and there are more than 5 items) */}
        {showAll && filteredEssentials.length > 5 && (
          <div className="mt-12 text-center">
            <GradientButton
              onClick={() => setShowAll(false)}
              className="px-8 py-3"
              variant="outline"
            >
              Show Less ←
            </GradientButton>
          </div>
        )}
      </div>
    </section>
  );
}
