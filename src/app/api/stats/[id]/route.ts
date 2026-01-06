import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateStatSchema } from "@/schemas/stat";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

// GET /api/stats/[id] - Get single stat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const stat = await prisma.stat.findUnique({
      where: { id },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    if (!stat) {
      return NextResponse.json(
        { error: "Stat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error fetching stat:", error);
    return NextResponse.json(
      { error: "Failed to fetch stat" },
      { status: 500 }
    );
  }
}

// PUT /api/stats/[id] - Update stat
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateStatSchema.parse({ ...body, id });

    const { countryIds, ...statData } = validatedData;

    // Delete existing country relations if countryIds provided
    if (countryIds !== undefined) {
      await prisma.statCountry.deleteMany({
        where: { statId: id },
      });
    }

    const stat = await prisma.stat.update({
      where: { id },
      data: {
        ...statData,
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

    return NextResponse.json(stat);
  } catch (error: any) {
    console.error("Error updating stat:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Stat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update stat" },
      { status: 500 }
    );
  }
}

// DELETE /api/stats/[id] - Delete stat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const { id } = await params;
    
    await prisma.stat.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Stat deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting stat:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Stat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete stat" },
      { status: 500 }
    );
  }
}
