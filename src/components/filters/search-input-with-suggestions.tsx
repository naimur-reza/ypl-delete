"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/hooks";

type SuggestionType = "universities" | "courses" | "scholarships" | "events";

interface Suggestion {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  type: SuggestionType;
}

interface SearchInputWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  suggestionType: SuggestionType;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  className?: string;
}

export function SearchInputWithSuggestions({
  value,
  onChange,
  onKeyDown,
  placeholder = "Search...",
  suggestionType,
  onSuggestionSelect,
  className,
}: SearchInputWithSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value, 300);

  // Fetch suggestions when debounced value changes
  useEffect(() => {
    if (debouncedValue.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search-suggestions?q=${encodeURIComponent(
            debouncedValue
          )}&type=${suggestionType}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setIsOpen(data.length > 0);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue, suggestionType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDownInternal = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) {
        onKeyDown?.(e);
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else {
            onKeyDown?.(e);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
        default:
          onKeyDown?.(e);
      }
    },
    [isOpen, suggestions, selectedIndex, onKeyDown]
  );

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onChange(suggestion.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSuggestionSelect?.(suggestion);
  };

  const handleClear = () => {
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: SuggestionType) => {
    switch (type) {
      case "universities":
        return "🏛️";
      case "courses":
        return "📚";
      case "scholarships":
        return "🎓";
      case "events":
        return "📅";
      default:
        return "🔍";
    }
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDownInternal}
          onFocus={() =>
            value.length >= 2 && suggestions.length > 0 && setIsOpen(true)
          }
          placeholder={placeholder}
          className={cn(
            "w-full px-3 md:px-4 py-3 md:py-3.5 rounded-lg border transition-all duration-300 text-sm pr-20",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
            "border-gray-300 dark:border-gray-600",
            className
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          )}
          {value && !loading && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 z-50",
            "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
            "rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/30",
            "max-h-80 overflow-y-auto overflow-x-hidden",
            "animate-in fade-in-0 slide-in-from-top-2 duration-200"
          )}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Suggestions ({suggestions.length})
            </span>
          </div>

          {/* Suggestions List */}
          <div className="p-1.5">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full px-4 py-3 text-left rounded-lg transition-all duration-150",
                  "flex items-center gap-3 group/item",
                  selectedIndex === index
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {/* Icon or Image */}
                <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">
                      {getTypeIcon(suggestion.type)}
                    </span>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {suggestion.name}
                  </p>
                  {suggestion.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.subtitle}
                    </p>
                  )}
                </div>

                {/* Arrow indicator */}
                <span
                  className={cn(
                    "text-gray-300 dark:text-gray-600 transition-all",
                    selectedIndex === index && "text-primary translate-x-1"
                  )}
                >
                  →
                </span>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="sticky bottom-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">
                  ↑↓
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">
                  ↵
                </kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">
                  esc
                </kbd>
                close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
