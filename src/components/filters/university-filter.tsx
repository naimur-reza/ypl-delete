"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FilterTabs } from "./filter-tabs";
import { FilterContent } from "./filter-content";
import { FILTER_TABS, type FilterTabType } from "@/lib/filter-config";

interface UniversityFilterProps {
  onOpenWizard?: () => void;
}

export function UniversityFilter({ onOpenWizard }: UniversityFilterProps = {}) {
  const [activeTab, setActiveTab] = useState<FilterTabType>("University");
  const router = useRouter();
  const params = useParams();
  const country = (params?.country as string) || "bd";

  const handleSearch = (value: string) => {
    console.log(`Searching in ${activeTab}:`, value);

    // Parse the filter values
    const filters: Record<string, string> = {};
    if (value) {
      value.split(",").forEach((pair) => {
        const [key, val] = pair.split(":");
        if (key && val) {
          filters[key] = val;
        }
      });
    }

    // Build search params
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      searchParams.set(key, val);
    });

    // Navigate based on active tab
    switch (activeTab) {
      case "University":
        router.push(`/${country}/universities?${searchParams.toString()}`);
        break;
      case "Course":
        router.push(`/${country}/courses?${searchParams.toString()}`);
        break;
      case "Scholarships":
        router.push(`/${country}/scholarships?${searchParams.toString()}`);
        break;
      case "Event":
        router.push(`/${country}/events?${searchParams.toString()}`);
        break;
      case "Guide":
        if (onOpenWizard) {
          onOpenWizard();
        } else {
          router.push(`/${country}/guide-me?${searchParams.toString()}`);
        }
        break;
      case "Offer":
        router.push(`/${country}/get-instant-offer`);
        break;
      default:
        console.warn("Unknown tab:", activeTab);
    }
  };

  return (
    <section className="w-full px-3 sm:px-4 md:px-6  relative z-20 pb-8 md:pb-12  -mt-22 ">
      <div className="max-w-6xl mx-auto">
        {/* Filter Card */}
        <div className="bg-gray-50  dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl shadow-gray-300/30 dark:shadow-black/40 border border-gray-200 dark:border-gray-800 overflow-visible">
          
          {/* Mobile Header - only show on mobile */}
          <div className="block md:hidden text-center py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explore</h2>
          </div>

          {/* Tabs - Grid on mobile, horizontal scroll on desktop */}
          <div className="p-3 sm:p-4 md:p-5 border-b border-gray-200 dark:border-gray-800">
            <FilterTabs
              tabs={FILTER_TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Content */}
          <FilterContent
            activeTab={activeTab}
            onSearch={handleSearch}
            onOpenWizard={onOpenWizard}
          />
        </div>
      </div>
    </section>
  );
}
