import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for intake creation/update
const intakeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().optional(),
  destinationId: z.string().min(1, "Destination is required"),
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

// GET /api/admin/intakes - List all intakes with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const destination = searchParams.get("destination");
    const intake = searchParams.get("intake");
    const country = searchParams.get("country");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (destination) where.destinationId = destination;
    if (intake) where.intake = intake;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Handle country/global filtering
    if (country === "global") {
      where.isGlobal = true;
    } else if (country) {
      where.countryId = country;
      where.isGlobal = false;
    }

    // Fetch intakes with relations
    const [intakes, total] = await Promise.all([
      prisma.intakePage.findMany({
        where,
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
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.intakePage.count({ where }),
    ]);

    return NextResponse.json({
      data: intakes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching intakes:", error);
    return NextResponse.json(
      { error: "Failed to fetch intakes" },
      { status: 500 },
    );
  }
}

// POST /api/admin/intakes - Create new intake
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = intakeSchema.parse(body);

    const timelineJson = validatedData.timelineJson
      ? JSON.parse(validatedData.timelineJson)
      : null;
    const howWeHelpJson = validatedData.howWeHelpJson
      ? JSON.parse(validatedData.howWeHelpJson)
      : null;

    // Check for duplicate intake
    const existingIntake = await prisma.intakePage.findFirst({
      where: {
        destinationId: validatedData.destinationId,
        intake: validatedData.intake,
        countryId: validatedData.countryId,
        isGlobal: validatedData.isGlobal,
      },
    });

    if (existingIntake) {
      return NextResponse.json(
        { error: "Intake already exists for this destination and intake" },
        { status: 409 },
      );
    }

    // Create intake
    const intake = await prisma.intakePage.create({
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

    return NextResponse.json(intake, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating intake:", error);
    return NextResponse.json(
      { error: "Failed to create intake" },
      { status: 500 },
    );
  }
}
