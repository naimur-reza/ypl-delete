import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get IP from request headers or fallback
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    let ip = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";

    console.log("Geo-location request - IP:", ip);

    // In development/localhost, we can't determine location
    // Return test data or null
    if (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "http://localhost:3000" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.")
    ) {
      console.log("Localhost detected");

      // For testing purposes, you can hardcode a country here
      // Uncomment the next 3 lines to test with a specific country
      // const testCountry = await prisma.country.findFirst({
      //   where: { isoCode: "BD", status: "ACTIVE" },
      //   select: { slug: true, name: true, isoCode: true },
      // });

      return NextResponse.json(
        {
          country: null,
          countrySlug: null,
          ip,
          message: "Localhost - no geo detection available in development",
        },
        { status: 200 }
      );
    }

    // For production, use geoip-lite
    let geo = null;
    try {
      const geoip = require("geoip-lite");
      geo = geoip.lookup(ip);
    } catch (geoError) {
      console.error("geoip-lite error:", geoError);
    }

    console.log("Geo lookup result:", geo);

    if (!geo) {
      return NextResponse.json(
        { country: null, countrySlug: null, ip, message: "No geo data found" },
        { status: 200 }
      );
    }

    // Find matching country in database by ISO code
    const matchedCountry = await prisma.country.findFirst({
      where: {
        isoCode: geo.country,
        status: "ACTIVE",
      },
      select: {
        slug: true,
        name: true,
        isoCode: true,
      },
    });

    console.log("Matched country:", matchedCountry);

    return NextResponse.json(
      {
        country: geo.country,
        countrySlug: matchedCountry?.slug || null,
        countryName: matchedCountry?.name || null,
        region: geo.region,
        city: geo.city,
        ip,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Geo-location API error:", error);
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
