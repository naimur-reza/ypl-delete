/**
 * Client-side data fetching hook with caching and fallback support
 * Use in client components for dynamic data fetching
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FALLBACK_PROJECTS,
  FALLBACK_CLIENTS,
  FALLBACK_SERVICES,
  FALLBACK_REVIEWS,
} from "@/lib/fallback-data";

export interface FetcherOptions {
  useFallback?: boolean;
  retryCount?: number;
  retryDelay?: number;
  cache?: boolean;
}

interface FetchState<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const dataCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Generic data fetcher hook
 */
function useDataFetcher<T>(
  endpoint: string,
  fallbackData: T[],
  options: FetcherOptions = {},
) {
  const {
    useFallback = true,
    retryCount = 3,
    retryDelay = 1000,
    cache = true,
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: fallbackData,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(
    async (attemptCount = 0) => {
      try {
        // Check cache first
        if (cache) {
          const cached = dataCache.get(endpoint);
          if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            setState({
              data: cached.data,
              isLoading: false,
              error: null,
            });
            return;
          }
        }

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache the data
        if (cache) {
          dataCache.set(endpoint, { data, timestamp: Date.now() });
        }

        setState({
          data: Array.isArray(data) ? data : [data],
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        if (attemptCount < retryCount) {
          setTimeout(
            () => fetchData(attemptCount + 1),
            retryDelay * (attemptCount + 1),
          );
        } else {
          setState({
            data: useFallback ? fallbackData : [],
            isLoading: false,
            error: err,
          });
        }
      }
    },
    [endpoint, fallbackData, useFallback, retryCount, retryDelay, cache],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    dataCache.delete(endpoint);
    fetchData();
  }, [endpoint, fetchData]);

  return { ...state, refetch };
}

/**
 * Hook to fetch projects
 */
export function useProjects(options: FetcherOptions = {}) {
  return useDataFetcher("/api/projects", FALLBACK_PROJECTS, options);
}

/**
 * Hook to fetch clients
 */
export function useClients(options: FetcherOptions = {}) {
  return useDataFetcher("/api/clients", FALLBACK_CLIENTS, options);
}

/**
 * Hook to fetch services
 */
export function useServices(options: FetcherOptions = {}) {
  return useDataFetcher("/api/services", FALLBACK_SERVICES, options);
}

/**
/**
 * Hook to fetch reviews
 */
export function useReviews(options: FetcherOptions = {}) {
  return useDataFetcher("/api/reviews", FALLBACK_REVIEWS, options);
}

/**
 * Custom hook for specific data type
 */
export function useFetchData<T>(
  endpoint: string,
  fallbackData: T[],
  options: FetcherOptions = {},
) {
  return useDataFetcher(endpoint, fallbackData, options);
}

/**
 * Clear all cached data
 */
export function clearDataCache() {
  dataCache.clear();
}

/**
 * Clear specific endpoint cache
 */
export function clearEndpointCache(endpoint: string) {
  dataCache.delete(endpoint);
}
