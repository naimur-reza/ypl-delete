import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/accreditations/[id] - Get single accreditation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const accreditation = await prisma.accreditation.findUnique({
      where: { id },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    if (!accreditation) {
      return NextResponse.json(
        { error: "Accreditation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error fetching accreditation:", error);
    return NextResponse.json(
      { error: "Failed to fetch accreditation" },
      { status: 500 }
    );
  }
}

