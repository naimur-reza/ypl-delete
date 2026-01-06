import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { destinationSectionSchema } from "@/schemas/destination-section";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

// GET: List all destination sections (with optional destinationId filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get("destinationId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where = destinationId ? { destinationId } : {};

    const [sections, total] = await Promise.all([
      prisma.destinationSection.findMany({
        where,
        include: {
          destination: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: [
          { destinationId: "asc" },
          { displayOrder: "asc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.destinationSection.count({ where }),
    ]);

    return NextResponse.json({
      data: sections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching destination sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination sections" },
      { status: 500 }
    );
  }
}

// POST: Create a new destination section
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await request.json();
    const validated = destinationSectionSchema.parse(body);

    // Check if destination exists
    const destination = await prisma.destination.findUnique({
      where: { id: validated.destinationId },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    // Check for duplicate slug within same destination
    const existing = await prisma.destinationSection.findUnique({
      where: {
        destinationId_slug: {
          destinationId: validated.destinationId,
          slug: validated.slug,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A section with this slug already exists for this destination" },
        { status: 400 }
      );
    }

    const section = await prisma.destinationSection.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        image: validated.image || null,
        content: validated.content || null,
        displayOrder: validated.displayOrder,
        isActive: validated.isActive,
        destinationId: validated.destinationId,
      },
      include: {
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("Error creating destination section:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create destination section" },
      { status: 500 }
    );
  }
}
