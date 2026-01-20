import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache with 5-minute expiration
let countriesCache: { 
  slugs: Set<string>; 
  isoToSlug: Map<string, string>;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Check if string is ISO country code (2-3 uppercase letters)
 */
const isIsoCode = (segment: string): boolean => /^[A-Z]{2,3}$/.test(segment);

/**
 * Fetch and cache active countries (slugs + ISO mappings)
 */
async function getCountriesCache() {
  const now = Date.now();

  // Return cache if valid
  if (countriesCache && now - countriesCache.timestamp < CACHE_DURATION) {
    return countriesCache;
  }

  try {
    // Single query to get both slugs and ISO codes
    const countries = await prisma.country.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, isoCode: true },
    });

    const slugs = new Set<string>();
    const isoToSlug = new Map<string, string>();

    countries.forEach((c) => {
      slugs.add(c.slug);
      isoToSlug.set(c.isoCode.toUpperCase(), c.slug);
    });

    countriesCache = { slugs, isoToSlug, timestamp: now };
    return countriesCache;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return { slugs: new Set<string>(), isoToSlug: new Map<string, string>(), timestamp: now };
  }
}

/**
 * Detect country from headers/IP
 */
async function detectCountrySlug(request: NextRequest): Promise<string | null> {
  const cache = await getCountriesCache();

  // Check Vercel geo header
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    const slug = cache.isoToSlug.get(vercelCountry.toUpperCase());
    if (slug) return slug;
  }

  // Check Cloudflare geo header
  const cfCountry = request.headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") {
    const slug = cache.isoToSlug.get(cfCountry.toUpperCase());
    if (slug) return slug;
  }

  // Fallback to IP-based detection
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip");

  // Skip private/local IPs
  if (!ip || 
      ip === "127.0.0.1" || 
      ip === "::1" || 
      /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(ip)) {
    return null;
  }

  try {
    const geoip = require("geoip-lite");
    const geo = geoip.lookup(ip);
    if (geo?.country) {
      return cache.isoToSlug.get(geo.country.toUpperCase()) || null;
    }
  } catch {
    // Silently fail if geoip-lite not available
  }

  return null;
}

/**
 * Create response with country header
 */
const withCountryHeader = (request: NextRequest, country: string | null): NextResponse => {
  const headers = new Headers(request.headers);
  country ? headers.set("x-country-slug", country) : headers.delete("x-country-slug");
  
  return NextResponse.next({ request: { headers } });
};

/**
 * Set country cookie on response
 */
const setCountryCookie = (response: NextResponse, slug: string) => {
  response.cookies.set("user-country", slug, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  response.cookies.delete("country-preference");
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip system routes early
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const cache = await getCountriesCache();
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // Handle ISO code in URL → redirect to slug
  if (firstSegment && isIsoCode(firstSegment)) {
    const slug = cache.isoToSlug.get(firstSegment);
    if (slug) {
      const redirectUrl = `/${slug}${pathname.slice(firstSegment.length + 1)}${request.nextUrl.search}`;
      const response = NextResponse.redirect(new URL(redirectUrl, request.url));
      setCountryCookie(response, slug);
      return response;
    }
  }

  const cookieCountry = request.cookies.get("user-country")?.value;
  const countryPreference = request.cookies.get("country-preference")?.value;

  // Homepage logic
  if (pathname === "/") {
    // User chose global - respect it
    if (countryPreference === "global") {
      return withCountryHeader(request, null);
    }

    // Redirect to cookie country if valid
    if (cookieCountry && cache.slugs.has(cookieCountry)) {
      return NextResponse.redirect(new URL(`/${cookieCountry}`, request.url));
    }

    // Try geo-detection
    const detectedSlug = await detectCountrySlug(request);
    if (detectedSlug && cache.slugs.has(detectedSlug)) {
      const response = NextResponse.redirect(new URL(`/${detectedSlug}`, request.url));
      setCountryCookie(response, detectedSlug);
      return response;
    }

    return withCountryHeader(request, null);
  }

  // Valid country route - set cookie
  if (firstSegment && cache.slugs.has(firstSegment)) {
    const response = withCountryHeader(request, firstSegment);
    setCountryCookie(response, firstSegment);
    return response;
  }

  // Non-country route with cookie - redirect to country version
  // (but not if user chose global)
  if (
    cookieCountry &&
    cache.slugs.has(cookieCountry) &&
    countryPreference !== "global"
  ) {
    return NextResponse.redirect(new URL(`/${cookieCountry}${pathname}`, request.url));
  }

  return withCountryHeader(request, null);
}

export const config = {
  matcher: [
    "/((?!api|admin|dashboard|auth|login|_next/static|_next/image|favicon.ico).*)",
  ],
};