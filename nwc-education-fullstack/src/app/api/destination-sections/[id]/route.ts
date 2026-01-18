import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { destinationSectionSchema } from "@/schemas/destination-section";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Get a single destination section
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const section = await prisma.destinationSection.findUnique({
      where: { id },
      include: {
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: "Destination section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Error fetching destination section:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination section" },
      { status: 500 }
    );
  }
}

// PUT: Update a destination section
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = destinationSectionSchema.parse(body);

    // Check if section exists
    const existing = await prisma.destinationSection.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Destination section not found" },
        { status: 404 }
      );
    }

    // Check for duplicate slug if slug changed
    if (validated.slug !== existing.slug || validated.destinationId !== existing.destinationId) {
      const duplicate = await prisma.destinationSection.findUnique({
        where: {
          destinationId_slug: {
            destinationId: validated.destinationId,
            slug: validated.slug,
          },
        },
      });

      if (duplicate && duplicate.id !== id) {
        return NextResponse.json(
          { error: "A section with this slug already exists for this destination" },
          { status: 400 }
        );
      }
    }

    const section = await prisma.destinationSection.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        image: validated.image || null,
        content: validated.content || null,
        displayOrder: validated.displayOrder,
        status: validated.status,
        destinationId: validated.destinationId,
      },
      include: {
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Error updating destination section:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update destination section" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a destination section
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const { id } = await params;

    const existing = await prisma.destinationSection.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Destination section not found" },
        { status: 404 }
      );
    }

    await prisma.destinationSection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting destination section:", error);
    return NextResponse.json(
      { error: "Failed to delete destination section" },
      { status: 500 }
    );
  }
}
