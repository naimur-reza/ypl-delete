"use client";

import { FILTER_TABS, FilterTabType } from "@/lib/filter-config";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  BookOpen,
  Award,
  Calendar,
  Sparkles,
  Tag,
} from "lucide-react";

interface FilterTabsProps {
  tabs: typeof FILTER_TABS;
  activeTab: FilterTabType;
  onTabChange: (tab: FilterTabType) => void;
}

const TAB_ICONS: Record<FilterTabType, React.ElementType> = {
  University: GraduationCap,
  Course: BookOpen,
  Scholarships: Award,
  Event: Calendar,
  Guide: Sparkles,
  Offer: Tag,
};

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <>
      {/* Mobile: 2-column Grid Layout */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        {tabs.map((tab) => {
          const Icon = TAB_ICONS[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate">{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    "text-[8px] px-1 py-0.5 rounded-full font-bold uppercase",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop: Horizontal scroll */}
      <div className="hidden md:block w-full overflow-x-auto scrollbar-hide -mx-1">
        <div className="flex items-center gap-2 px-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = TAB_ICONS[tab.id];
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap group",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )}
                />
                <span>{tab.label}</span>
                
                {tab.badge && (
                  <span
                    className={cn(
                      "ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
