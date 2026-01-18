import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateHeroSchema } from "@/schemas/hero";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const hero = await prisma.hero.findUnique({
      where: { id },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    if (!hero) {
      return NextResponse.json({ error: "Hero not found" }, { status: 404 });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error fetching hero:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const { id } = await params;
  try {
    const body = await request.json();
    const validatedData = updateHeroSchema.parse({ ...body, id });

    const { id: _id, countryIds, ...heroData } = validatedData;

    // If countryIds is provided, update the relations
    const updateData: any = {
      ...heroData,
    };

    if (countryIds !== undefined) {
      // Delete existing country relations and create new ones
      await prisma.heroCountry.deleteMany({
        where: { heroId: id },
      });

      if (countryIds.length > 0) {
        updateData.countries = {
          create: countryIds.map((countryId) => ({
            countryId,
          })),
        };
      }
    }

    const hero = await prisma.hero.update({
      where: { id },
      data: updateData,
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json(hero);
  } catch (error: any) {
    console.error("Error updating hero:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Hero not found" }, { status: 404 });
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A hero with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update hero" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const { id } = await params;
  try {
    await prisma.hero.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Hero deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting hero:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Hero not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete hero" },
      { status: 500 }
    );
  }
}
