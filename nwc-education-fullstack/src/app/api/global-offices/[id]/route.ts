import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/global-offices/[id] - Get single global office
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const globalOffice = await prisma.globalOffice.findUnique({
      where: { id },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    if (!globalOffice) {
      return NextResponse.json(
        { error: "Global office not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(globalOffice);
  } catch (error) {
    console.error("Error fetching global office:", error);
    return NextResponse.json(
      { error: "Failed to fetch global office" },
      { status: 500 }
    );
  }
}

