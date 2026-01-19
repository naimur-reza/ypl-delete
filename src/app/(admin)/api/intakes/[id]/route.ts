import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const intakeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  destinationId: z.string().min(1),
  intake: z.enum(["JANUARY", "MAY", "SEPTEMBER"]),
  countryId: z.string().nullable().optional(),
  isGlobal: z.boolean().default(false),
  status: z.enum(["DRAFT", "ACTIVE"]).default("DRAFT"),

  // Hero Section
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroMedia: z.string().url().optional(),
  heroCTALabel: z.string().optional(),
  heroCTAUrl: z.string().optional(),

  // Why Choose Section
  whyChooseTitle: z.string().optional(),
  whyChooseDescription: z.string().optional(),

  // Timeline & Countdown
  timelineJson: z.string().optional(),
  targetDate: z.string().datetime().optional(),
  timelineEnabled: z.boolean().default(true),

  // How We Help
  howWeHelpJson: z.string().optional(),
  howWeHelpEnabled: z.boolean().default(true),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
});

// GET /api/admin/intakes/[id] - Get single intake
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const intake = await prisma.intakePage.findUnique({
      where: { id },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        country: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        intakePageBenefits: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: {
            faqs: true,
          },
        },
      },
    });

    if (!intake) {
      return NextResponse.json({ error: "Intake not found" }, { status: 404 });
    }

    return NextResponse.json(intake);
  } catch (error) {
    console.error("Error fetching intake:", error);
    return NextResponse.json(
      { error: "Failed to fetch intake" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/intakes/[id] - Update intake
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = intakeSchema.parse(body);
    const timelineJson = validatedData.timelineJson
      ? JSON.parse(validatedData.timelineJson)
      : null;
    const howWeHelpJson = validatedData.howWeHelpJson
      ? JSON.parse(validatedData.howWeHelpJson)
      : null;

    // Check if intake exists
    const existingIntake = await prisma.intakePage.findUnique({
      where: { id },
    });

    if (!existingIntake) {
      return NextResponse.json({ error: "Intake not found" }, { status: 404 });
    }

    // Check for duplicate (excluding current intake)
    const duplicateIntake = await prisma.intakePage.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            destinationId: validatedData.destinationId,
            intake: validatedData.intake,
            countryId: validatedData.countryId,
            isGlobal: validatedData.isGlobal,
          },
        ],
      },
    });

    if (duplicateIntake) {
      return NextResponse.json(
        { error: "Intake already exists for this destination and intake" },
        { status: 409 },
      );
    }

    // Update intake
    const updatedIntake = await prisma.intakePage.update({
      where: { id },
      data: {
        ...validatedData,
        timelineJson,
        howWeHelpJson,
        targetDate: validatedData.targetDate
          ? new Date(validatedData.targetDate)
          : null,
      },
      include: {
        destination: true,
        country: true,
        intakePageBenefits: true,
      },
    });

    return NextResponse.json(updatedIntake);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error updating intake:", error);
    return NextResponse.json(
      { error: "Failed to update intake" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/intakes/[id] - Delete intake
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check if intake exists
    const existingIntake = await prisma.intakePage.findUnique({
      where: { id },
    });

    if (!existingIntake) {
      return NextResponse.json({ error: "Intake not found" }, { status: 404 });
    }

    // Delete intake (cascade will handle related records)
    await prisma.intakePage.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Intake deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting intake:", error);
    return NextResponse.json(
      { error: "Failed to delete intake" },
      { status: 500 },
    );
  }
}

// POST /api/admin/intakes/[id]/duplicate - Duplicate intake
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { newTitle } = body;

    // Get original intake
    const originalIntake = await prisma.intakePage.findUnique({
      where: { id },
      include: {
        intakePageBenefits: true,
      },
    });

    if (!originalIntake) {
      return NextResponse.json(
        { error: "Original intake not found" },
        { status: 404 },
      );
    }

    // Create duplicate with new title
    const duplicatedIntake = await prisma.intakePage.create({
      data: {
        ...originalIntake,
        id: undefined, // Remove original ID
        title: newTitle || `${originalIntake.title} (Copy)`,
        status: "DRAFT", // Start as draft
        createdAt: undefined, // Let database set new timestamp
        updatedAt: undefined,
        intakePageBenefits: {
          create: originalIntake.intakePageBenefits.map((benefit) => ({
            title: benefit.title,
            description: benefit.description,
            icon: benefit.icon,
            sortOrder: benefit.sortOrder,
          })),
        },
      },
      include: {
        destination: true,
        country: true,
        intakePageBenefits: true,
      },
    });

    return NextResponse.json(duplicatedIntake, { status: 201 });
  } catch (error) {
    console.error("Error duplicating intake:", error);
    return NextResponse.json(
      { error: "Failed to duplicate intake" },
      { status: 500 },
    );
  }
}
