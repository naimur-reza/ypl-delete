import { useState, useMemo, useCallback } from "react";

export interface FilterState {
  [key: string]: string[];
}

export interface UseFilterOptions<T> {
  data: T[];
  filterConfig: {
    [key: string]: {
      getValue: (item: T) => string | string[] | null | undefined;
      matchType?: "exact" | "includes" | "search";
    };
  };
  searchFields?: Array<keyof T | ((item: T) => string | null | undefined)>;
}

export function useFilter<T>({
  data,
  filterConfig,
  searchFields = [],
}: UseFilterOptions<T>) {
  const [filters, setFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFilter = useCallback((category: string, value: string) => {
    setFilters((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const newFilters = { ...prev };
      if (updated.length > 0) {
        newFilters[category] = updated;
      } else {
        delete newFilters[category];
      }
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery("");
  }, []);

  const setFilter = useCallback((category: string, values: string[]) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (values.length > 0) {
        newFilters[category] = values;
      } else {
        delete newFilters[category];
      }
      return newFilters;
    });
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        return searchFields.some((field) => {
          const value = typeof field === "function" ? field(item) : item[field];
          return value?.toString().toLowerCase().includes(query);
        });
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([category, values]) => {
      if (!values || values.length === 0) return;

      const config = filterConfig[category];
      if (!config) return;

      result = result.filter((item) => {
        const itemValue = config.getValue(item);

        if (itemValue === null || itemValue === undefined) return false;

        const matchType = config.matchType || "exact";

        if (Array.isArray(itemValue)) {
          // For array values (e.g., multiple countries), check if any match
          return itemValue.some((val) => {
            const strVal = String(val).toLowerCase();
            return values.some((filterVal) => {
              const strFilter = String(filterVal).toLowerCase();
              return matchType === "includes"
                ? strVal.includes(strFilter) || strFilter.includes(strVal)
                : strVal === strFilter;
            });
          });
        }

        const strItemValue = String(itemValue).toLowerCase();
        return values.some((filterVal) => {
          const strFilter = String(filterVal).toLowerCase();
          switch (matchType) {
            case "includes":
              return (
                strItemValue.includes(strFilter) ||
                strFilter.includes(strItemValue)
              );
            case "search":
              return strItemValue.includes(strFilter);
            case "exact":
            default:
              return strItemValue === strFilter;
          }
        });
      });
    });

    return result;
  }, [data, filters, searchQuery, filterConfig, searchFields]);

  const activeFilterCount = useMemo(() => {
    return (
      Object.values(filters).reduce(
        (sum, values) => sum + (values?.length || 0),
        0
      ) + (searchQuery.trim() ? 1 : 0)
    );
  }, [filters, searchQuery]);

  return {
    filters,
    searchQuery,
    filteredData,
    activeFilterCount,
    toggleFilter,
    clearFilters,
    setFilter,
    setSearchQuery,
  };
}
