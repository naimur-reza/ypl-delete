import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Multi-provider geo-location detection with caching
 * Priority order:
 * 1. Vercel's x-vercel-ip-country header (most accurate on Vercel)
 * 2. Cloudflare's CF-IPCountry header (if using Cloudflare)
 * 3. ipinfo.io API (external service, more accurate than geoip-lite)
 * 4. geoip-lite (local database, last resort)
 */

interface GeoResult {
  country: string | null;
  source: string;
}

// In-memory cache for IP geolocation results (24 hours)
const ipGeoCache = new Map<string, { result: GeoResult; timestamp: number }>();
const IP_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache for database country lookups (5 minutes)
const countryDbCache = new Map<string, { country: any; timestamp: number }>();
const DB_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function detectCountryFromHeaders(request: NextRequest): Promise<GeoResult | null> {
  // Check Vercel's geo header first (most reliable on Vercel deployment)
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return { country: vercelCountry, source: "vercel" };
  }

  // Check Cloudflare's geo header
  const cfCountry = request.headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") {
    return { country: cfCountry, source: "cloudflare" };
  }

  return null;
}

async function detectCountryFromIpinfoApi(ip: string): Promise<GeoResult | null> {
  try {
    // ipinfo.io free tier - 50k requests/month
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.country) {
        return { country: data.country, source: "ipinfo" };
      }
    }
  } catch {
    // Silently fail
  }
  return null;
}

async function detectCountryFromGeoipLite(ip: string): Promise<GeoResult | null> {
  try {
    const geoip = require("geoip-lite");
    const geo = geoip.lookup(ip);
    if (geo?.country) {
      return { country: geo.country, source: "geoip-lite" };
    }
  } catch {
    // Silently fail
  }
  return null;
}

async function getCachedCountryFromDb(isoCode: string) {
  const cacheKey = isoCode.toUpperCase();
  const now = Date.now();
  
  // Check cache first
  const cached = countryDbCache.get(cacheKey);
  if (cached && now - cached.timestamp < DB_CACHE_DURATION) {
    return cached.country;
  }
  
  // Fetch from database
  const country = await prisma.country.findFirst({
    where: { isoCode: cacheKey, status: "ACTIVE" },
    select: { slug: true, name: true, isoCode: true },
  });
  
  // Store in cache
  countryDbCache.set(cacheKey, { country, timestamp: now });
  
  return country;
}

export async function GET(request: NextRequest) {
  try {
    // Get IP from request headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";

    // Check if localhost (development mode)
    const isLocalhost =
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
      ip.startsWith("172.31.");

    if (isLocalhost) {
      // Test mode: return Bangladesh for local development
      const testCountry = await getCachedCountryFromDb("BD");

      if (testCountry) {
        const response = NextResponse.json(
          {
            country: testCountry.isoCode,
            countrySlug: testCountry.slug,
            countryName: testCountry.name,
            ip,
            source: "test-mode",
            message: "Localhost - TEST MODE with Bangladesh",
          },
          { status: 200 }
        );

        response.cookies.set("detected_geo_origin", testCountry.isoCode, {
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
        });

        return response;
      }

      return NextResponse.json(
        { country: null, countrySlug: null, ip, message: "Localhost - no test country found" },
        { status: 200 }
      );
    }

    // Multi-provider geo detection for production
    let geoResult: GeoResult | null = null;
    
    // Check if we have cached result for this IP
    const cachedIpGeo = ipGeoCache.get(ip);
    const now = Date.now();
    
    if (cachedIpGeo && now - cachedIpGeo.timestamp < IP_CACHE_DURATION) {
      // Use cached result
      geoResult = cachedIpGeo.result;
    } else {
      // 1. Try Vercel/Cloudflare headers first (fastest, most accurate)
      geoResult = await detectCountryFromHeaders(request);

      // 2. If no header detection, try ipinfo.io API
      if (!geoResult) {
        geoResult = await detectCountryFromIpinfoApi(ip);
      }

      // 3. Last resort: geoip-lite local database
      if (!geoResult) {
        geoResult = await detectCountryFromGeoipLite(ip);
      }
      
      // Cache the result if we found one
      if (geoResult) {
        ipGeoCache.set(ip, { result: geoResult, timestamp: now });
      }
    }

    if (!geoResult || !geoResult.country) {
      return NextResponse.json(
        {
          country: null,
          countrySlug: null,
          ip,
          message: "No geo data found from any provider"
        },
        { status: 200 }
      );
    }

    // Find matching country in database using cached lookup
    const matchedCountry = await getCachedCountryFromDb(geoResult.country);

    const response = NextResponse.json(
      {
        country: geoResult.country,
        countrySlug: matchedCountry?.slug || null,
        countryName: matchedCountry?.name || null,
        ip,
        source: geoResult.source,
      },
      { status: 200 }
    );

    // Set cookie for future reference
    if (geoResult.country) {
      response.cookies.set("detected_geo_origin", geoResult.country.toUpperCase(), {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get location",
        country: null,
        countrySlug: null,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}
