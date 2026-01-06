import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { heroSchema } from "@/schemas/hero";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

// GET /api/heroes - Fetch all heroes with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    const countryId = searchParams.get("countryId");
    const isActive = searchParams.get("isActive");

    const where: any = {};

    if (slug) {
      where.slug = slug;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (countryId) {
      where.countries = {
        some: {
          countryId: countryId,
        },
      };
    }

    const heroes = await prisma.hero.findMany({
      where,
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(heroes);
  } catch (error) {
    console.error("Error fetching heroes:", error);
    return NextResponse.json(
      { error: "Failed to fetch heroes" },
      { status: 500 }
    );
  }
}

// POST /api/heroes - Create new hero
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await request.json();
    const validatedData = heroSchema.parse(body);

    const { countryIds, ...heroData } = validatedData;

    const hero = await prisma.hero.create({
      data: {
        ...heroData,
        countries: countryIds
          ? {
              create: countryIds.map((countryId) => ({
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

    return NextResponse.json(hero, { status: 201 });
  } catch (error: any) {
    console.error("Error creating hero:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create hero" },
      { status: 500 }
    );
  }
}
