import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache for countries with 5-minute expiration
let countriesCache: { slugs: Set<string>; timestamp: number } | null = null;
// In-memory cache for ISO to slug mappings with 5-minute expiration
let isoToSlugCache: { mappings: Map<string, string>; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Check if a string looks like an ISO country code (2-3 uppercase letters)
 */
function isIsoCode(segment: string): boolean {
  // ISO codes are typically 2-3 uppercase letters
  return /^[A-Z]{2,3}$/.test(segment);
}

/**
 * Convert ISO code to slug with caching
 */
async function convertIsoToSlug(isoCode: string): Promise<string | null> {
  const now = Date.now();
  const upperIso = isoCode.toUpperCase();

  // Return cached data if still valid
  if (isoToSlugCache && now - isoToSlugCache.timestamp < CACHE_DURATION) {
    const cachedSlug = isoToSlugCache.mappings.get(upperIso);
    if (cachedSlug) {
      return cachedSlug;
    }
  }

  try {
    // Fetch from database
    const country = await prisma.country.findFirst({
      where: {
        isoCode: upperIso,
        status: "ACTIVE",
      },
      select: { slug: true, isoCode: true },
    });

    if (country) {
      // Update cache (initialize if needed)
      if (!isoToSlugCache || now - isoToSlugCache.timestamp >= CACHE_DURATION) {
        isoToSlugCache = {
          mappings: new Map(),
          timestamp: now,
        };
      }
      isoToSlugCache.mappings.set(upperIso, country.slug);
      return country.slug;
    }

    return null;
  } catch (error) {
    console.error("Error converting ISO to slug:", error);
    return null;
  }
}

/**
 * Fetch active country slugs with in-memory caching
 */
async function getActiveCountrySlugs(): Promise<Set<string>> {
  const now = Date.now();

  // Return cached data if still valid
  if (countriesCache && now - countriesCache.timestamp < CACHE_DURATION) {
    return countriesCache.slugs;
  }

  try {
    // Fetch from database
    const countries = await prisma.country.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true },
    });

    const slugs = new Set(countries.map((c) => c.slug));

    // Update cache
    countriesCache = {
      slugs,
      timestamp: now,
    };

    return slugs;
  } catch (error) {
    console.error("Error fetching countries in middleware:", error);
    // Return empty set on error, but don't cache the error
    return new Set();
  }
}

/**
 * Detect country from IP and headers
 */
async function detectCountry(request: NextRequest): Promise<string | null> {
  // 1. Check Vercel's geo header (most reliable on Vercel)
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    const slug = await convertIsoToSlug(vercelCountry);
    if (slug) {
      return slug;
    }
  }

  // 2. Check Cloudflare's geo header
  const cfCountry = request.headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") {
    const slug = await convertIsoToSlug(cfCountry);
    if (slug) {
      return slug;
    }
  }

  // 3. Fallback to IP-based detection (geoip-lite)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded ? forwarded.split(",")[0].trim() : realIp || null;

  if (!ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.")
  ) {
    return null;
  }

  try {
    const geoip = require("geoip-lite");
    const geo = geoip.lookup(ip);

    if (!geo || !geo.country) {
      return null;
    }

    const slug = await convertIsoToSlug(geo.country);
    return slug;
  } catch (error) {
    return null;
  }
}

const withCountryHeader = (
  request: NextRequest,
  country: string | null
): NextResponse => {
  const requestHeaders = new Headers(request.headers);
  if (country) {
    requestHeaders.set("x-country-slug", country);
  } else {
    requestHeaders.delete("x-country-slug");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for specific paths (admin/system routes)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") || // Static files
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Get active country slugs
  const validCountrySlugs = await getActiveCountrySlugs();

  // Extract first segment (potential country)
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // Check if first segment is an ISO code and convert to slug if needed
  if (firstSegment && isIsoCode(firstSegment) && !validCountrySlugs.has(firstSegment)) {
    const slugFromIso = await convertIsoToSlug(firstSegment);
    if (slugFromIso) {
      // Redirect from ISO code URL to slug URL
      const remainingPath = pathname.slice(`/${firstSegment}`.length) || "";
      const redirectUrl = `/${slugFromIso}${remainingPath}${request.nextUrl.search}`;
      const response = NextResponse.redirect(new URL(redirectUrl, request.url));
      // Set the slug in cookie, not the ISO code
      response.cookies.set("user-country", slugFromIso, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      response.cookies.delete("country-preference");
      return response;
    }
  }

  // Homepage: redirect only if cookie country matches a valid slug
  // AND user hasn't explicitly chosen global
  if (pathname === "/") {
    const countryPreference = request.cookies.get("country-preference")?.value;
    const cookieCountry = request.cookies.get("user-country")?.value;
    const detectedGeoOrigin = request.cookies.get("detected_geo_origin")?.value;

    // If user explicitly chose global, don't redirect
    if (countryPreference === "global") {
      return withCountryHeader(request, null);
    }

    // If we have a cookie country, use it
    if (cookieCountry && validCountrySlugs.has(cookieCountry)) {
      return NextResponse.redirect(new URL(`/${cookieCountry}`, request.url));
    }

    // If no cookie country but we have geo origin cookie, try to match it
    if (!cookieCountry && detectedGeoOrigin) {
      const matchedCountry = await prisma.country.findFirst({
        where: {
          isoCode: detectedGeoOrigin.toUpperCase(),
          status: "ACTIVE",
        },
        select: { slug: true },
      });

      if (matchedCountry && validCountrySlugs.has(matchedCountry.slug)) {
        const response = NextResponse.redirect(
          new URL(`/${matchedCountry.slug}`, request.url)
        );
        response.cookies.set("user-country", matchedCountry.slug, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
        return response;
      }
    }

    // If no cookies at all, try geo-detection
    if (!cookieCountry && !detectedGeoOrigin) {
      const detectedSlug = await detectCountry(request);

      if (detectedSlug && validCountrySlugs.has(detectedSlug)) {
        const response = NextResponse.redirect(
          new URL(`/${detectedSlug}`, request.url)
        );
        response.cookies.set("user-country", detectedSlug, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });

        // Find matching ISO code to set detected_geo_origin
        const country = await prisma.country.findFirst({
          where: { slug: detectedSlug, status: "ACTIVE" },
          select: { isoCode: true },
        });

        if (country) {
          response.cookies.set("detected_geo_origin", country.isoCode, {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
          });
        }
        return response;
      }
    }

    return withCountryHeader(request, null);
  }

  // Handle country-specific routes
  if (firstSegment && validCountrySlugs.has(firstSegment)) {
    // Valid country - save to cookie and clear global preference
    const response = withCountryHeader(request, firstSegment);
    response.cookies.set("user-country", firstSegment, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    // Clear global preference when user navigates to a country
    response.cookies.delete("country-preference");
    return response;
  }

  // If route doesn't have country slug but cookie exists, redirect to country-specific route
  // BUT exclude admin/system routes from this redirect
  // AND respect user's explicit global preference
  const countryPreference = request.cookies.get("country-preference")?.value;
  const cookieCountry = request.cookies.get("user-country")?.value;
  const isAdminOrSystemRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin");

  if (
    cookieCountry &&
    validCountrySlugs.has(cookieCountry) &&
    pathname !== "/" &&
    !isAdminOrSystemRoute &&
    countryPreference !== "global" // Don't redirect if user chose global
  ) {
    return NextResponse.redirect(
      new URL(`/${cookieCountry}${pathname}`, request.url)
    );
  }

  // For all other routes (including invalid country slugs), let them pass through
  // The layout will handle 404 for invalid countries. Strip any lingering header.
  return withCountryHeader(request, null);
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - admin (Admin routes)
     * - dashboard (Dashboard routes)
     * - auth (Auth routes)
     * - login (Login routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|admin|dashboard|auth|login|_next/static|_next/image|favicon.ico).*)",
  ],
};
