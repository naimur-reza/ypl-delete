"use client";

import type React from "react";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
}

export function FilterInput({
  value,
  onChange,
  onSearch,
  onKeyDown,
  placeholder,
}: FilterInputProps) {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={cn(
          "flex-1 md:flex-initial px-5 py-3.5 rounded-xl border",
          "bg-white/50 dark:bg-black/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200",
          "min-w-[200px] border-white/20 dark:border-white/10"
        )}
      />

      <button
        onClick={onSearch}
        className={cn(
          "px-8 py-3.5 rounded-xl font-bold transition-all duration-300",
          "bg-linear-to-r from-primary to-accent text-white shadow-lg shadow-primary/25",
          "hover:shadow-xl hover:shadow-primary/40 hover:scale-105 hover:-translate-y-0.5",
          "flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
        )}
      >
        <Search className="w-5 h-5" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
}
