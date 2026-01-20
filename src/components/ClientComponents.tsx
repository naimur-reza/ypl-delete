"use client";

import dynamic from "next/dynamic";

// Dynamically import components to avoid blocking initial render
export const GeoRedirectOptimized = dynamic(
  () =>
    import("@/components/GeoRedirectOptimized").then((mod) => ({
      default: mod.GeoRedirectOptimized,
    })),
  {
    loading: () => null, // Show nothing while loading
  },
);

export const PerformanceMonitor = dynamic(
  () =>
    import("@/components/PerformanceMonitor").then((mod) => ({
      default: mod.PerformanceMonitor,
    })),
  {
    loading: () => null,
  },
);
