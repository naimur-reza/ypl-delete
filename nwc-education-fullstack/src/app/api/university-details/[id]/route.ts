import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const universityDetail = await prisma.universityDetail.findUnique({
      where: { id },
      include: { university: true },
    });

    if (!universityDetail) {
      return Response.json(
        { error: "University detail not found" },
        { status: 404 }
      );
    }

    return Response.json(universityDetail);
  } catch (error) {
    console.error("Error fetching university detail:", error);
    return Response.json(
      { error: "Failed to fetch university detail" },
      { status: 500 }
    );
  }
}
