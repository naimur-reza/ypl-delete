"use client";

import { useEffect } from "react";

interface PerformanceMetrics {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  domContentLoaded?: number;
  loadComplete?: number;
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") return;

    const observer = new PerformanceObserver((list) => {
      const metrics: PerformanceMetrics = {};

      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case "paint":
            if (entry.name === "first-contentful-paint") {
              metrics.firstContentfulPaint = entry.startTime;
            }
            break;
          case "largest-contentful-paint":
            metrics.largestContentfulPaint = entry.startTime;
            break;
          case "navigation":
            const navEntry = entry as PerformanceNavigationTiming;
            metrics.domContentLoaded =
              navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
            metrics.loadComplete = navEntry.loadEventEnd - navEntry.fetchStart;
            break;
        }
      }

      // Log performance metrics
      if (metrics.firstContentfulPaint || metrics.largestContentfulPaint) {
        console.log("Performance Metrics:", metrics);

        // Send to analytics service if needed
        if (
          metrics.firstContentfulPaint &&
          metrics.firstContentfulPaint > 3000
        ) {
          console.warn(
            "Slow first contentful paint detected:",
            metrics.firstContentfulPaint,
          );
        }

        if (
          metrics.largestContentfulPaint &&
          metrics.largestContentfulPaint > 4000
        ) {
          console.warn(
            "Slow largest contentful paint detected:",
            metrics.largestContentfulPaint,
          );
        }
      }
    });

    try {
      observer.observe({
        entryTypes: ["paint", "largest-contentful-paint", "navigation"],
      });
    } catch (e) {
      // PerformanceObserver not supported
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
