"use client";

import React, { useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  label?: string;
}

// Get all available Lucide icons
const iconList = Object.keys(Icons).filter(
  (key) =>
    key !== "createLucideIcon" &&
    key !== "icons" &&
    typeof Icons[key as keyof typeof Icons] === "object"
);

// Popular icons to show first
const popularIcons = [
  "GraduationCap",
  "BookOpen",
  "Award",
  "Target",
  "Users",
  "Globe",
  "Star",
  "CheckCircle",
  "FileText",
  "Calendar",
  "Clock",
  "DollarSign",
  "TrendingUp",
  "Zap",
  "Heart",
  "Shield",
  "Briefcase",
  "Plane",
  "Home",
  "Mail",
];

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase();
    const filtered = iconList.filter((iconName) =>
      iconName.toLowerCase().includes(searchLower)
    );

    // Show popular icons first if no search
    if (!search) {
      const popular = filtered.filter((icon) => popularIcons.includes(icon));
      const others = filtered.filter((icon) => !popularIcons.includes(icon));
      return [...popular, ...others];
    }

    return filtered;
  }, [search]);

  const IconComponent = value
    ? (Icons[value as keyof typeof Icons] as React.ComponentType<any>)
    : null;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-10"
            type="button"
          >
            {IconComponent ? (
              <>
                <IconComponent className="w-4 h-4" />
                <span className="flex-1 text-left">{value}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Select an icon...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-6 gap-2 p-3">
              {filteredIcons.slice(0, 120).map((iconName) => {
                const Icon = Icons[
                  iconName as keyof typeof Icons
                ] as React.ComponentType<any>;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-accent hover:border-primary transition-colors ${
                      value === iconName
                        ? "bg-accent border-primary"
                        : "border-transparent"
                    }`}
                    title={iconName}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[9px] mt-1 text-muted-foreground truncate w-full text-center">
                      {iconName
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .slice(0, 8)}
                    </span>
                  </button>
                );
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No icons found
              </div>
            )}
          </ScrollArea>
          {value && (
            <div className="p-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="w-full"
                type="button"
              >
                Clear Selection
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
