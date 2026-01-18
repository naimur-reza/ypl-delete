"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export function GeoRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Skip if already on a country route (user manually selected)
    const countryRouteRegex = /^\/(bd|pk|in|au|uk|us|ca)/;
    if (countryRouteRegex.test(pathname)) {
      // User is on a country route - mark that they've made a manual selection
      const currentCountry = pathname.split("/")[1];
      localStorage.setItem("manual-country-selection", currentCountry);
      return;
    }

    // Skip if on admin or API routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
      return;
    }

    // Check if user has manually selected a country before
    const manualSelection = localStorage.getItem("manual-country-selection");
    if (manualSelection) {
      // User has previously made a manual selection, respect it
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

    // Fetch user's country from our internal geo-location API
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
        if (countrySlug) {
          console.log(`Redirecting to country: ${countrySlug}`);

          // Mark as redirected for this session
          sessionStorage.setItem("geo-redirected", "true");
          hasRedirected.current = true;

          // Redirect to the matched country route
          const newPath = `/${countrySlug}${pathname === "/" ? "" : pathname}`;
          router.push(newPath);
        } else {
          console.log("No matching country found in database");
        }
      })
      .catch((error) => {
        console.error("Geo-location failed:", error);
        // Silently fail - don't break the app
      });
  }, [pathname, router]);

  return null;
}
