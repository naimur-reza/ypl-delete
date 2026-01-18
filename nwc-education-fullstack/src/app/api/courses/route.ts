import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { handleGetMany } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";
import { Course } from "../../../../prisma/src/generated/prisma/browser";

const courseSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  summary: z.string().max(300).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  duration: z.string().optional().nullable(),
  studyLevel: z.enum([
    "FOUNDATION",
    "BACHELOR",
    "MASTER",
    "PHD",
    "DIPLOMA",
    "CERTIFICATE",
    "PATHWAY",
  ]).optional().nullable(),
  faculty: z.enum([
    "ENGINEERING",
    "BUSINESS",
    "ARTS_HUMANITIES",
    "SCIENCE",
    "MEDICINE_HEALTH",
    "LAW",
    "EDUCATION",
    "SOCIAL_SCIENCES",
    "IT_COMPUTING",
    "ARCHITECTURE",
    "AGRICULTURE",
    "HOSPITALITY_TOURISM",
    "MEDIA_COMMUNICATION",
    "OTHER",
  ]).optional().nullable(),
  tuitionMin: z.number().optional().nullable(),
  tuitionMax: z.number().optional().nullable(),
  currency: z.string().default("USD"),
  universityId: z.string().min(1),
  destinationId: z.string().min(1),
  image: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
  sections: z
    .object({
      overview: z.string().optional(),
      entryRequirements: z.string().optional(),
      costOfStudy: z.string().optional(),
      scholarships: z.string().optional(),
      careers: z.string().optional(),
      admission: z.string().optional(),
    })
    .optional()
    .nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();

    // Validate body
    const validation = courseSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if slug exists
    const existing = await prisma.course.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return Response.json({ error: "Slug already exists" }, { status: 409 });
    }

    // Create course - sections needs to be JSON serialized
    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        summary: data.summary,
        icon: data.icon,
        image: data.image,
        duration: data.duration,
        studyLevel: data.studyLevel,
        faculty: data.faculty,
        tuitionMin: data.tuitionMin,
        tuitionMax: data.tuitionMax,
        currency: data.currency,
        universityId: data.universityId,
        destinationId: data.destinationId,
        isFeatured: data.isFeatured,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        sections: data.sections as any, // Prisma will handle JSON serialization
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      },
    });

    return Response.json(course, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating course:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create course",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();

    // Extract ID first before validation
    const { id, ...dataToValidate } = body;

    if (!id) {
      return Response.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Validate body WITHOUT the id field
    const validation = courseSchema.safeParse(dataToValidate);
    if (!validation.success) {
      return Response.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if course exists
    const existing = await prisma.course.findUnique({
      where: { id },
    });

    if (!existing) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }

    // Update course with ALL fields including the previously missing ones
    const course = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        summary: data.summary,
        icon: data.icon,
        image: data.image,
        duration: data.duration,
        studyLevel: data.studyLevel,
        faculty: data.faculty,
        tuitionMin: data.tuitionMin,
        tuitionMax: data.tuitionMax,
        currency: data.currency,
        universityId: data.universityId,
        destinationId: data.destinationId,
        isFeatured: data.isFeatured,
        status: data.status,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        sections: data.sections as any, // Prisma will handle JSON serialization
        updatedBy: data.updatedBy,
      },
    });

    return Response.json(course, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating course:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update course",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleGetMany<Course>(req, prisma.course, {
    searchFields: ["title", "slug"],
    defaultSort: { createdAt: "desc" },
    include: {
      destination: true,
      university: true,
    }
  });
}
