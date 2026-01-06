/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.testimonial, {
    searchFields: ["name", "content"],
    defaultSort: { order: "asc" },
    include: {
      countries: { include: { country: true } },
      destinations: { include: { destination: true } },
      universities: { include: { university: true } },
      events: { include: { event: true } },
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    type, // STUDENT | REPRESENTATIVE | GMB
    mediaType,
    name,
    role,
    content,
    rating,
    avatar,
    videoUrl,
    url,
    isFeatured,
    order,
    countryIds,
    destinationIds,
    universityIds,
    eventIds,
  } = body;

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        type,
        mediaType,
        name,
        role,
        content,
        rating: rating ? Number(rating) : undefined,
        avatar,
        videoUrl,
        url,
        isFeatured: isFeatured || false,
        order: order ? Number(order) : 0,
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
      },
      include: {
        countries: { include: { country: true } },
        destinations: { include: { destination: true } },
        universities: { include: { university: true } },
        events: { include: { event: true } },
      },
    });

    return Response.json(testimonial, { status: 201 });
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return Response.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    id,
    countryIds,
    destinationIds,
    universityIds,
    eventIds,
    order,
    rating,
    ...data
  } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing associations
      const deletePromises = [
        tx.testimonialCountry.deleteMany({ where: { testimonialId: id } }),
        tx.testimonialDestination.deleteMany({
          where: { testimonialId: id },
        }),
        tx.testimonialUniversity.deleteMany({
          where: { testimonialId: id },
        }),
        tx.testimonialEvent.deleteMany({ where: { testimonialId: id } }),
      ];
      await Promise.all(deletePromises);

      // Update testimonial
      const testimonial = await tx.testimonial.update({
        where: { id },
        data: {
          ...data,
          order: order !== undefined ? Number(order) : undefined,
          rating:
            rating !== undefined ? (rating ? Number(rating) : null) : undefined,
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
        },
        include: {
          countries: { include: { country: true } },
          destinations: { include: { destination: true } },
          universities: { include: { university: true } },
          events: { include: { event: true } },
        },
      });

      return testimonial;
    });

    return Response.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error updating testimonial:", error);
    return Response.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  return handleDelete(id, prisma.testimonial, {
    revalidatePaths: ["/dashboard/testimonials"],
  });
}
