"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export function GeoRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Skip if already on a country route (user manually selected)
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    // Check if we're on a country route by checking if first segment matches known country slugs
    // This is a fallback check - middleware should handle most redirects
    if (firstSegment && firstSegment.length <= 3) {
      // Likely a country route, skip redirect
      return;
    }

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

    // Check if user has explicitly chosen global preference
    const countryPreference = getCookie("country-preference");
    if (countryPreference === "global") {
      return;
    }

    // Check if user already has a country cookie set (middleware should have handled this)
    const userCountry = getCookie("user-country");
    if (userCountry) {
      return;
    }

    // Check if we've already redirected in this session
    if (hasRedirected.current) {
      return;
    }

    // Check if user has already been redirected (stored in sessionStorage for this session only)
    const sessionRedirected = sessionStorage.getItem("geo-redirected");
    if (sessionRedirected) {
      return;
    }

    // Only run on homepage as a fallback if middleware didn't redirect
    // This is a client-side fallback for cases where middleware might not have run
    if (pathname !== "/") {
      return;
    }

    // Fetch user's country from our internal geo-location API
    // This is a fallback - middleware should handle most cases
    fetch("/api/geo-location")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const countrySlug = data.countrySlug;

        // Only redirect if we found a matching country in the database
        // and user hasn't explicitly chosen global
        if (countrySlug && pathname === "/") {
          // Mark as redirected for this session
          sessionStorage.setItem("geo-redirected", "true");
          hasRedirected.current = true;

          // Redirect to the matched country route
          router.push(`/${countrySlug}`);
        }
      })
      .catch(() => {
        // Silently fail - don't break the app
      });
  }, [pathname, router]);

  return null;
}
