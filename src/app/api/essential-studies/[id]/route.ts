import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/essential-studies/[id] - Get single essential study
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const essentialStudy = await prisma.essentialStudy.findUnique({
      where: { id },
      include: {
        destination: true,
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    if (!essentialStudy) {
      return NextResponse.json(
        { error: "Essential study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(essentialStudy);
  } catch (error) {
    console.error("Error fetching essential study:", error);
    return NextResponse.json(
      { error: "Failed to fetch essential study" },
      { status: 500 }
    );
  }
}

