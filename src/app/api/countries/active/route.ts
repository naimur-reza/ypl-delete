import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/countries/active
 * Public endpoint to fetch all active countries for the country selector
 */
export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        flag: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(countries, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching active countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}

// Enable revalidation
export const revalidate = 300; // 5 minutes
