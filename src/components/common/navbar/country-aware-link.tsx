"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { useCountry as useCountryContext } from "@/lib/country-context";

interface CountryAwareLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

const isExternal = (href: string) =>
  href.startsWith("http") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:");

const isHash = (href: string) => href.startsWith("#");

/**
 * Check if a route is an admin/system route that should never have country prefix
 */
const isAdminRoute = (href: string): boolean => {
  // Remove leading slash for easier matching
  const cleanHref = href.startsWith("/") ? href.slice(1) : href;

  // Admin routes that should never have country prefix
  const adminRoutePrefixes = [
    "dashboard",
    "auth",
    "login",
    "api",
    "admin",
    "_next", // Next.js internal routes
  ];

  // Check if href starts with any admin route prefix
  return adminRoutePrefixes.some((prefix) => cleanHref.startsWith(prefix));
};

/**
 * Get cookie value by name (client-side only)
 */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

/**
 * Country-aware Link
 * - preserves country slug for internal navigation
 * - uses cookie as fallback when country context is null
 * - respects user's explicit global preference
 * - leaves hash/absolute links untouched
 */
export function CountryAwareLink({
  href,
  children,
  className,
  ...props
}: CountryAwareLinkProps) {
  const { country: contextCountry } = useCountryContext();
  // Initialize cookie country as null to match server render
  // This prevents hydration mismatch
  const [cookieCountry, setCookieCountry] = useState<string | null>(null);
  const [isGlobalPreference, setIsGlobalPreference] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read cookie only after hydration to prevent mismatch
  useEffect(() => {
    setIsHydrated(true);
    if (!contextCountry) {
      setCookieCountry(getCookie("user-country"));
    }
    // Check if user explicitly chose global
    setIsGlobalPreference(getCookie("country-preference") === "global");
  }, [contextCountry]);

  // Use context country first, only use cookie after hydration and if no context
  // Don't use cookie country if user explicitly chose global
  const country = isGlobalPreference
    ? null
    : contextCountry ||
      (isHydrated && !isGlobalPreference ? cookieCountry : null);

  const finalHref = useMemo(() => {
    // Don't add country prefix for:
    // - External links
    // - Hash links
    // - Admin/system routes (dashboard, auth, login, api, etc.)
    // - When user explicitly chose global
    if (!country || isExternal(href) || isHash(href) || isAdminRoute(href)) {
      return href;
    }

    // If href already has country prefix, return as-is
    if (href.startsWith(`/${country}`)) return href;

    // Add country prefix for public routes
    if (href.startsWith("/")) return `/${country}${href}`;
    return `/${country}/${href}`;
  }, [country, href]);

  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  );
}
