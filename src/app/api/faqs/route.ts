/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.fAQ, {
    searchFields: ["question", "answer"],
    defaultSort: { createdAt: "desc" },
    include: {
      countries: { include: { country: true } },
      destinations: { include: { destination: true } },
      universities: { include: { university: true } },
      events: { include: { event: true } },
      courses: { include: { course: true } },
      scholarships: { include: { scholarship: true } },
      intakePages: { include: { intakePage: true } },
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    question,
    answer,
    countryIds,
    destinationIds,
    universityIds,
    eventIds,
    courseIds,
    scholarshipIds,
    intakePageIds,
    isGlobal,
  } = body;

  if (!question || !answer) {
    return Response.json(
      { error: "Question and answer are required" },
      { status: 400 }
    );
  }

  try {
    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        isGlobal: isGlobal || false,
        countries: countryIds?.length
          ? {
              create: (countryIds || []).map((countryId: string) => ({
                countryId,
              })),
            }
          : undefined,
        destinations: destinationIds?.length
          ? {
              create: (destinationIds || []).map((destinationId: string) => ({
                destinationId,
              })),
            }
          : undefined,
        universities: universityIds?.length
          ? {
              create: (universityIds || []).map((universityId: string) => ({
                universityId,
              })),
            }
          : undefined,
        events: eventIds?.length
          ? {
              create: (eventIds || []).map((eventId: string) => ({
                eventId,
              })),
            }
          : undefined,
        courses: courseIds?.length
          ? {
              create: (courseIds || []).map((courseId: string) => ({
                courseId,
              })),
            }
          : undefined,
        scholarships: scholarshipIds?.length
          ? {
              create: (scholarshipIds || []).map((scholarshipId: string) => ({
                scholarshipId,
              })),
            }
          : undefined,
        intakePages: intakePageIds?.length
          ? {
              create: (intakePageIds || []).map((intakePageId: string) => ({
                intakePageId,
              })),
            }
          : undefined,
      },
      include: {
        countries: { include: { country: true } },
        destinations: { include: { destination: true } },
        universities: { include: { university: true } },
        events: { include: { event: true } },
        courses: { include: { course: true } },
        scholarships: { include: { scholarship: true } },
        intakePages: { include: { intakePage: true } },
      },
    });

    return Response.json(faq, { status: 201 });
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    return Response.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const {
    id,
    countryIds,
    destinationIds,
    universityIds,
    eventIds,
    courseIds,
    scholarshipIds,
    intakePageIds,
    ...data
  } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing associations
      await tx.fAQCountry.deleteMany({
        where: { faqId: id },
      });
      await tx.fAQDestination.deleteMany({ where: { faqId: id } });
      await tx.fAQUniversity.deleteMany({ where: { faqId: id } });
      await tx.fAQEvent.deleteMany({ where: { faqId: id } });
      await tx.fAQCourse.deleteMany({ where: { faqId: id } });
      await tx.fAQScholarship.deleteMany({ where: { faqId: id } });
      await tx.fAQIntakePage.deleteMany({ where: { faqId: id } });

      // Update FAQ
      const faq = await tx.fAQ.update({
        where: { id },
        data: {
          ...data,
          countries: countryIds?.length
            ? {
                create: (countryIds || []).map((countryId: string) => ({
                  countryId,
                })),
              }
            : undefined,
          destinations: destinationIds?.length
            ? {
                create: (destinationIds || []).map((destinationId: string) => ({
                  destinationId,
                })),
              }
            : undefined,
          universities: universityIds?.length
            ? {
                create: (universityIds || []).map((universityId: string) => ({
                  universityId,
                })),
              }
            : undefined,
          events: eventIds?.length
            ? {
                create: (eventIds || []).map((eventId: string) => ({
                  eventId,
                })),
              }
            : undefined,
          courses: courseIds?.length
            ? {
                create: (courseIds || []).map((courseId: string) => ({
                  courseId,
                })),
              }
            : undefined,
          scholarships: scholarshipIds?.length
            ? {
                create: (scholarshipIds || []).map((scholarshipId: string) => ({
                  scholarshipId,
                })),
              }
            : undefined,
          intakePages: intakePageIds?.length
            ? {
                create: (intakePageIds || []).map((intakePageId: string) => ({
                  intakePageId,
                })),
              }
            : undefined,
        },
        include: {
          countries: { include: { country: true } },
          destinations: { include: { destination: true } },
          universities: { include: { university: true } },
          events: { include: { event: true } },
          courses: { include: { course: true } },
          scholarships: { include: { scholarship: true } },
          intakePages: { include: { intakePage: true } },
        },
      });

      return faq;
    });

    return Response.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error updating FAQ:", error);
    return Response.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  return handleDelete(id, prisma.fAQ, {
    revalidatePaths: ["/dashboard/faqs"],
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { faqIds, operation, entityType, entityIds } = body;

  if (!faqIds || !Array.isArray(faqIds) || faqIds.length === 0) {
    return Response.json(
      { error: "FAQ IDs array is required" },
      { status: 400 }
    );
  }

  if (!operation || !["assign", "remove"].includes(operation)) {
    return Response.json(
      { error: "Operation must be 'assign' or 'remove'" },
      { status: 400 }
    );
  }

  if (!entityType) {
    return Response.json({ error: "Entity type is required" }, { status: 400 });
  }

  if (!entityIds || !Array.isArray(entityIds) || entityIds.length === 0) {
    return Response.json(
      { error: "Entity IDs array is required" },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const faqId of faqIds) {
        try {
          // Map entity type to relation table
          const relationMap: Record<string, { model: any; field: string }> = {
            countries: { model: tx.fAQCountry, field: "countryId" },
            destinations: { model: tx.fAQDestination, field: "destinationId" },
            universities: { model: tx.fAQUniversity, field: "universityId" },
            events: { model: tx.fAQEvent, field: "eventId" },
            courses: { model: tx.fAQCourse, field: "courseId" },
            scholarships: { model: tx.fAQScholarship, field: "scholarshipId" },
            intakePages: { model: tx.fAQIntakePage, field: "intakePageId" },
          };

          const relation = relationMap[entityType];
          if (!relation) {
            errorCount++;
            errors.push(`Invalid entity type: ${entityType}`);
            continue;
          }

          if (operation === "assign") {
            // Create relations (skip duplicates)
            for (const entityId of entityIds) {
              try {
                await relation.model.create({
                  data: {
                    faqId,
                    [relation.field]: entityId,
                  },
                });
              } catch (err: any) {
                // Ignore unique constraint errors (already exists)
                if (err.code !== "P2002") {
                  throw err;
                }
              }
            }
          } else {
            // Remove relations
            await relation.model.deleteMany({
              where: {
                faqId,
                [relation.field]: { in: entityIds },
              },
            });
          }

          successCount++;
        } catch (err: any) {
          errorCount++;
          errors.push(`FAQ ${faqId}: ${err.message}`);
        }
      }

      return { successCount, errorCount, errors };
    });

    return Response.json(
      {
        success: true,
        ...result,
        message: `Successfully ${operation}ed ${result.successCount} FAQ(s)`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in bulk operation:", error);
    return Response.json(
      { error: "Failed to perform bulk operation" },
      { status: 500 }
    );
  }
}
