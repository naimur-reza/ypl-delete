"use client";

import { Calendar, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOption } from "@/components/filters/reusable-filter";
import { cn } from "@/lib/utils";

interface EventFilterBarProps {
  filterOptions: FilterOption[];
  selectedFilters: {
    month?: string;
    eventType?: string;
    city?: string;
  };
  onFilterChange: (
    category: "month" | "eventType" | "city",
    value: string
  ) => void;
}

export function EventFilterBar({
  filterOptions,
  selectedFilters,
  onFilterChange,
}: EventFilterBarProps) {
  // Extract options for each filter
  const monthOptions =
    filterOptions.find((f) => f.id === "month")?.options || [];
  const eventTypeOptions =
    filterOptions.find((f) => f.id === "eventType")?.options || [];
  const cityOptions = // Changed from locationOptions to cityOptions
    filterOptions.find((f) => f.id === "city")?.options || []; // Changed from "location" to "city"

  return (
    <div className="bg-white rounded-xl border border-border mb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-300">
        {/* Month Filter */}
        <div className="flex-1 px-4 py-3">
          <Select
            value={selectedFilters.month || ""}
            onValueChange={(value) => onFilterChange("month", value || "")}
          >
            <SelectTrigger className="w-full border-0 cursor-pointer shadow-none h-auto p-0 hover:bg-transparent focus:ring-0 bg-transparent">
              <div className="flex items-center gap-2 w-full">
                <Calendar className="h-4 w-4 text-gray-600 shrink-0" />
                <SelectValue placeholder="Month" className="text-gray-600" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-400 ml-2">
                        ({option.count})
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event Type Filter */}
        <div className="flex-1 px-4 py-3">
          <Select
            value={selectedFilters.eventType || undefined}
            onValueChange={(value) => onFilterChange("eventType", value || "")}
          >
            <SelectTrigger className="w-full border-0 cursor-pointer shadow-none h-auto p-0 hover:bg-transparent focus:ring-0 bg-transparent">
              <div className="flex items-center gap-2 w-full">
                <SelectValue
                  placeholder="Event type"
                  className="text-gray-600"
                />
                <ChevronDown className="h-4 w-4 text-gray-600 shrink-0 ml-auto" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {eventTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value || "_"}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-400 ml-2">
                        ({option.count})
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Filter */}
        <div className="flex-1 px-4 py-3">
          <Select
            value={selectedFilters.city || undefined}
            onValueChange={(value) => onFilterChange("city", value || "")}
          >
            <SelectTrigger className="w-full border-0 cursor-pointer shadow-none h-auto p-0 hover:bg-transparent focus:ring-0 bg-transparent">
              <div className="flex items-center gap-2 w-full">
                <SelectValue
                  placeholder="City"
                  className={cn(
                    selectedFilters.city ? "text-blue-600" : "text-gray-600"
                  )}
                />
                <ChevronDown className="h-4 w-4 text-gray-600 shrink-0 ml-auto" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {cityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-400 ml-2">
                        ({option.count})
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
