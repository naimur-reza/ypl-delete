import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/intake-seasons/[id] - Get single intake season
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const intakeSeason = await prisma.intakeSeason.findUnique({
      where: { id },
      include: {
        countries: { include: { country: true } },
        destination: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!intakeSeason) {
      return NextResponse.json(
        { error: "Intake season not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(intakeSeason);
  } catch (error) {
    console.error("Error fetching intake season:", error);
    return NextResponse.json(
      { error: "Failed to fetch intake season" },
      { status: 500 }
    );
  }
}

