"use client";

import { useState } from "react";
import {
  ChevronDown,
  FilterX,
  Search,
  SlidersHorizontal,
  X,
  Briefcase,
  GraduationCap,
  Calendar,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  ACADEMIC_QUALIFICATIONS,
  AVAILABILITY,
  INDUSTRIES,
  LOCATIONS,
  POSITIONS,
  PROFESSIONAL_QUALIFICATIONS,
} from "@/lib/candidate-options";

export type CandidateFiltersState = {
  department: string;
  role: string;
  industry: string;
  location: string;
  educationalQualification: string;
  professionalQualification: string;
  currentPosition: string;
  availability: string;
  onlyExpired: boolean;
  hasCv: boolean;
  registrationFrom: string;
  registrationTo: string;
};

type Chip = { key: string; label: string; remove: () => void };

// A more compact section header for a grid layout
function FilterGroup({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-2 p-3 rounded-lg bg-muted/20 border border-border/40",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3.5 w-3.5 text-orange-600" />
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function CandidateFiltersPanel({
  keyword,
  onKeywordChange,
  showAdvanced,
  onToggleAdvanced,
  filters,
  setFilter,
  clearFilters,
  departments,
  roles,
  experienceMin,
  experienceMax,
  onExperienceMinChange,
  onExperienceMaxChange,
  activeChips,
  hasActiveFilters,
  onClearAll,
}: {
  keyword: string;
  onKeywordChange: (v: string) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  filters: CandidateFiltersState;
  setFilter: (
    key: keyof CandidateFiltersState,
    value: string | boolean,
  ) => void;
  clearFilters: () => void;
  departments: string[];
  roles: string[];
  experienceMin: string;
  experienceMax: string;
  onExperienceMinChange: (v: string) => void;
  onExperienceMaxChange: (v: string) => void;
  activeChips: Chip[];
  hasActiveFilters: boolean;
  onClearAll: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-md overflow-hidden transition-all">
      {/* Top Bar: Search & Primary Actions */}
      <div className="p-3 flex items-center gap-3 bg-white">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Search candidates..."
            className="pl-9 h-10 border-none bg-muted/40 focus-visible:ring-orange-500/20 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-10 text-xs text-muted-foreground hover:text-orange-600"
            >
              Reset
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onToggleAdvanced}
            className={cn(
              "h-10 gap-2 font-medium border-border/60 transition-all",
              showAdvanced
                ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700"
                : "hover:bg-muted",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeChips.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-orange-600 text-[10px] font-bold">
                {activeChips.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Active Chips Row (Only visible if chips exist) */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 pb-3 bg-white">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.remove}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-100 text-[11px] font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      {/* Advanced Filters: Grid Layout */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out border-t border-border/40 bg-muted/5",
          showAdvanced
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Group 1: Role & Experience */}
            <FilterGroup title="Role & Experience" icon={Briefcase}>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={filters.department}
                  onValueChange={(v) => setFilter("department", v)}
                >
                  <SelectTrigger className="h-9 bg-white w-full">
                    <SelectValue placeholder="Dept" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Depts</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.role}
                  onValueChange={(v) => setFilter("role", v)}
                >
                  <SelectTrigger className="h-9 bg-white w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Roles</SelectItem>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Min Exp"
                  value={experienceMin}
                  onChange={(e) => onExperienceMinChange(e.target.value)}
                  className="h-9 bg-white"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <Input
                  placeholder="Max"
                  value={experienceMax}
                  onChange={(e) => onExperienceMaxChange(e.target.value)}
                  className="h-9 bg-white"
                />
              </div>
            </FilterGroup>

            {/* Group 2: Qualifications & Industry */}
            <FilterGroup title="Background" icon={GraduationCap}>
              <Select
                value={filters.educationalQualification}
                onValueChange={(v) => setFilter("educationalQualification", v)}
              >
                <SelectTrigger className="h-9 bg-white w-full">
                  <SelectValue placeholder="Education" />
                </SelectTrigger>
                <SelectContent>
                  {["__all__", ...ACADEMIC_QUALIFICATIONS].map((e) => (
                    <SelectItem key={e} value={e}>
                      {e === "__all__" ? "Any Education" : e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.industry}
                onValueChange={(v) => setFilter("industry", v)}
              >
                <SelectTrigger className="h-9 bg-white w-full">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any Industry</SelectItem>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterGroup>

            {/* Group 3: Availability & Date */}
            <FilterGroup title="Status & Date" icon={Calendar}>
              <Select
                value={filters.availability}
                onValueChange={(v) => setFilter("availability", v)}
              >
                <SelectTrigger className="h-9 bg-white w-full">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any Availability</SelectItem>
                  {AVAILABILITY.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filters.registrationFrom}
                  onChange={(e) =>
                    setFilter("registrationFrom", e.target.value)
                  }
                  className="h-9 bg-white text-xs"
                />
                <Input
                  type="date"
                  value={filters.registrationTo}
                  onChange={(e) => setFilter("registrationTo", e.target.value)}
                  className="h-9 bg-white text-xs"
                />
              </div>
            </FilterGroup>

            {/* Group 4: Toggle Switches (Spans full width on small, or fits in grid) */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-wrap gap-6 px-3 py-2 bg-orange-50/50 rounded-lg border border-orange-100/50">
              <div className="flex items-center gap-3">
                <Switch
                  checked={filters.hasCv}
                  onCheckedChange={(v) => setFilter("hasCv", v)}
                />
                <span className="text-xs font-medium">Has CV Uploaded</span>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={filters.onlyExpired}
                  onCheckedChange={(v) => setFilter("onlyExpired", v)}
                />
                <span className="text-xs font-medium">
                  Expired Only (6+ months)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
