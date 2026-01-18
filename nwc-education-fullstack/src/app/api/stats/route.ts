import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { statSchema } from "@/schemas/stat";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

// GET /api/stats - Fetch all stats with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get("section");
    const countryId = searchParams.get("countryId");
    const status = searchParams.get("status");
    const slideIndex = searchParams.get("slideIndex");

    const where: any = {};

    if (section) {
      where.section = section;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (slideIndex !== null && slideIndex !== undefined) {
      where.slideIndex = parseInt(slideIndex, 10);
    }

    if (countryId) {
      where.countries = {
        some: {
          countryId: countryId,
        },
      };
    }

    const stats = await prisma.stat.findMany({
      where,
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

// POST /api/stats - Create new stat
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await request.json();
    const validatedData = statSchema.parse(body);

    const { countryIds, status, ...statData } = validatedData as any;

    const stat = await prisma.stat.create({
      data: {
        ...statData,
        status: status || "ACTIVE",
        countries: countryIds
          ? {
              create: countryIds.map((countryId: any) => ({
                countryId,
              })),
            }
          : undefined,
      },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json(stat, { status: 201 });
  } catch (error: any) {
    console.error("Error creating stat:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create stat" },
      { status: 500 }
    );
  }
}
