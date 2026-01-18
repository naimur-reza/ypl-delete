import { prisma } from "@/lib/prisma";

// GET the currently active intake season
export async function GET() {
  try {
    const activeSeason = await prisma.intakeSeason.findFirst({
      where: { status: "ACTIVE" },
      include: {
        countries: {
          include: { country: true },
        },
      },
    });

    if (!activeSeason) {
      return Response.json({ data: null }, { status: 200 });
    }

    return Response.json({ data: activeSeason }, { status: 200 });
  } catch (error) {
    console.error("Error fetching active intake season:", error);
    return Response.json(
      { error: "Failed to fetch active intake season" },
      { status: 500 }
    );
  }
}
