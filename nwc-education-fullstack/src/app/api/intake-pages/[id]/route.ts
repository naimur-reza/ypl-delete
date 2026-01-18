import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/intake-pages/[id] - Get single intake page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const intakePage = await prisma.intakePage.findUnique({
      where: { id },
      include: {
        destination: true,
        intakePageBenefits: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!intakePage) {
      return NextResponse.json(
        { error: "Intake page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(intakePage);
  } catch (error) {
    console.error("Error fetching intake page:", error);
    return NextResponse.json(
      { error: "Failed to fetch intake page" },
      { status: 500 }
    );
  }
}

