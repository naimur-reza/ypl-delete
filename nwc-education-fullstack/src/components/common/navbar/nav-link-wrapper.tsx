"use client"

import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";

interface NavLinkWrapperProps {
  children: ReactNode;
}

/**
 * Client component that provides country context to navigation links
 * This ensures all navigation preserves the country slug
 */
export function NavLinkWrapper({ children }: NavLinkWrapperProps) {
  const pathname = usePathname();
  
  // Extract country from current path
  const country = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) || [];
    // If first segment looks like a country code (2-3 letters), it's the country
    if (segments.length > 0 && segments[0].length <= 3) {
      return segments[0];
    }
    return null;
  }, [pathname]);

  // If we're on a country-specific route, add data attribute for CSS or JS to use
  if (country) {
    return (
      <div data-country={country}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook to get the current country from URL
 * Use this in client components that need to build country-aware links
 */
export function useCountry(): string | null {
  const pathname = usePathname();
  
  const country = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) || [];
    if (segments.length > 0 && segments[0].length <= 3) {
      return segments[0];
    }
    return null;
  }, [pathname]);

  return country;
}

/**
 * Helper to build country-aware URLs
 */
export function buildCountryUrl(path: string, country: string | null): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  if (country) {
    return `/${country}/${cleanPath}`;
  }
  
  return `/${cleanPath}`;
}
