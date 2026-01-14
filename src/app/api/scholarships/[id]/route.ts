import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/scholarships/[id] - Get single scholarship
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!scholarship) {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error("Error fetching scholarship:", error);
    return NextResponse.json(
      { error: "Failed to fetch scholarship" },
      { status: 500 }
    );
  }
}

