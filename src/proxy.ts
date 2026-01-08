import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache for countries with 5-minute expiration
let countriesCache: { slugs: Set<string>; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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
      where: { isActive: true },
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

  // Homepage: redirect only if cookie country matches a valid slug
  // AND user hasn't explicitly chosen global
  if (pathname === "/") {
    const countryPreference = request.cookies.get("country-preference")?.value;
    const cookieCountry = request.cookies.get("user-country")?.value;

    // If user explicitly chose global, don't redirect
    if (countryPreference === "global") {
      return withCountryHeader(request, null);
    }

    if (cookieCountry && validCountrySlugs.has(cookieCountry)) {
      return NextResponse.redirect(new URL(`/${cookieCountry}`, request.url));
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
