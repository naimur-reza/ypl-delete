"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export function GeoRedirectOptimized() {
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only run as a fallback on homepage
    if (pathname !== "/") return;

    // Skip if already on a country route
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    if (firstSegment && firstSegment.length <= 3) return;

    // Skip if on admin or API routes
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/_next")
    ) {
      return;
    }

    // Check if user has explicit preferences or cookies
    const countryPreference = getCookie("country-preference");
    const userCountry = getCookie("user-country");

    if (countryPreference === "global" || userCountry) return;

    // Prevent multiple redirects
    if (hasRedirected.current) return;
    const sessionRedirected = sessionStorage.getItem("geo-redirected");
    if (sessionRedirected) return;

    // Only fetch geo location as last resort with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    fetch("/api/geo-location", {
      signal: controller.signal,
      priority: "low", // Low priority to not block critical resources
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const countrySlug = data.countrySlug;

        if (countrySlug && pathname === "/") {
          sessionStorage.setItem("geo-redirected", "true");
          hasRedirected.current = true;
          router.push(`/${countrySlug}`);
        }
      })
      .catch(() => {
        // Silently fail - don't break the app
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [pathname, router]);

  return null;
}
