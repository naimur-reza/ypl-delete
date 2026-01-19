"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter } from "lucide-react";
import { SearchParams } from "@/types";

interface IntakeFiltersProps {
  searchParams: SearchParams;
}

const INTAKE_OPTIONS = [
  { value: "JANUARY", label: "January" },
  { value: "MAY", label: "May" },
  { value: "SEPTEMBER", label: "September" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
];

const SCOPE_OPTIONS = [
  { value: "global", label: "Global" },
  { value: "country", label: "Country-Specific" },
];

export function IntakeFilters({ searchParams }: IntakeFiltersProps) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentFilters = {
    destination: searchParams.destination || "",
    intake: searchParams.intake || "",
    country: searchParams.country || "",
    status: searchParams.status || "",
    scope: searchParams.scope || "",
    search: searchParams.search || "",
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParamsObj.toString());

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // Reset to page 1 when filtering
    newParams.delete("page");

    router.push(`?${newParams.toString()}`);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    router.push(`?${newParams.toString()}`);
  };

  const hasActiveFilters = Object.values(currentFilters).some(
    (value) => value !== "",
  );

  const activeFilterCount = Object.values(currentFilters).filter(
    (value) => value !== "",
  ).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount} active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      </div>

      {/* Always Visible Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search intakes..."
            value={currentFilters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Destination */}
        <Select
          value={currentFilters.destination}
          onValueChange={(value) => updateFilter("destination", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Destinations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Destinations</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="usa">United States</SelectItem>
            <SelectItem value="canada">Canada</SelectItem>
            <SelectItem value="australia">Australia</SelectItem>
          </SelectContent>
        </Select>

        {/* Intake */}
        <Select
          value={currentFilters.intake}
          onValueChange={(value) => updateFilter("intake", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Intakes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Intakes</SelectItem>
            {INTAKE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={currentFilters.status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Country */}
          <Select
            value={currentFilters.country}
            onValueChange={(value) => updateFilter("country", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              <SelectItem value="bangladesh">Bangladesh</SelectItem>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="pakistan">Pakistan</SelectItem>
              <SelectItem value="srilanka">Sri Lanka</SelectItem>
              <SelectItem value="nepal">Nepal</SelectItem>
            </SelectContent>
          </Select>

          {/* Scope */}
          <Select
            value={currentFilters.scope}
            onValueChange={(value) => updateFilter("scope", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Scopes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Scopes</SelectItem>
              {SCOPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          {currentFilters.search && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: {currentFilters.search}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("search", "")}
              />
            </Badge>
          )}
          {currentFilters.destination && (
            <Badge variant="outline" className="flex items-center gap-1">
              Destination: {currentFilters.destination}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("destination", "")}
              />
            </Badge>
          )}
          {currentFilters.intake && (
            <Badge variant="outline" className="flex items-center gap-1">
              Intake: {currentFilters.intake}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("intake", "")}
              />
            </Badge>
          )}
          {currentFilters.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {currentFilters.status}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("status", "")}
              />
            </Badge>
          )}
          {currentFilters.country && (
            <Badge variant="outline" className="flex items-center gap-1">
              Country: {currentFilters.country}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("country", "")}
              />
            </Badge>
          )}
          {currentFilters.scope && (
            <Badge variant="outline" className="flex items-center gap-1">
              Scope: {currentFilters.scope}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("scope", "")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
