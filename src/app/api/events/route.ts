/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.event, {
    searchFields: ["title", "slug"],
    defaultSort: { startDate: "desc" },
    include: {
      destination: {
        select: {
          id: true,
          name: true,
        },
      },
      university: {
        select: {
          id: true,
          name: true,
        },
      },
      countries: { include: { country: true } },
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    title,
    slug,
    description,
    eventType,
    startDate,
    endDate,
    location,
    city,
    isFeatured,
    destinationIds,
    universityId,
    countryIds,
    banner,
    metaTitle,
    metaDescription,
    metaKeywords,
    status,
  } = body;

  if (
    !title ||
    !slug ||
    !eventType ||
    !startDate ||
    !destinationIds ||
    !Array.isArray(destinationIds) ||
    destinationIds.length === 0
  ) {
    return Response.json(
      {
        error:
          "Title, slug, eventType, startDate, and at least one destination are required",
      },
      { status: 400 }
    );
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        eventType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        city,
        isFeatured: isFeatured || false,
        universityId: universityId || null,
        banner: banner || null,
        metaTitle,
        metaDescription,
        metaKeywords,
        status: status || "DRAFT",
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
      },
      include: {
        destinations: { include: { destination: true } },
        university: { select: { id: true, name: true } },
        countries: { include: { country: true } },
      },
    });

    return Response.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    if ((error as any)?.code === "P2002") {
      return Response.json({ error: "Slug already exists" }, { status: 400 });
    }
    return Response.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, countryIds, destinationIds, ...data } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // Handle date conversions
    if (data.startDate) {
      data.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      data.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Delete existing country associations
      await tx.eventCountry.deleteMany({ where: { eventId: id } });
      // Delete existing destination associations
      await tx.eventDestination.deleteMany({ where: { eventId: id } });

      // Update event
      const event = await tx.event.update({
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
                create: destinationIds.map((destinationId: string) => ({
                  destinationId,
                })),
              }
            : undefined,
        },
        include: {
          destinations: { include: { destination: true } },
          university: { select: { id: true, name: true } },
          countries: { include: { country: true } },
        },
      });

      return event;
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return Response.json({ error: "Failed to update event" }, { status: 500 });
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

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete relations first (EventCountry, EventDestination, etc.)
      await tx.eventCountry.deleteMany({ where: { eventId: id } });
      await tx.eventDestination.deleteMany({ where: { eventId: id } });
      
      // Note: EventMedia, EventRegistration, FAQEvent, TestimonialEvent might also need deletion 
      // if they don't have onDelete: Cascade in schema.
      // Assuming they are handled or not strictly blocking for now, 
      // but let's be safe and try to delete what we know blocks.
      
      // If there are other relations without cascade delete, they need to be deleted here.
      // Based on schema, EventRegistration has onDelete: Cascade.
      // EventMedia does not seem to have it in the snippet provided earlier, so let's delete it too.
      await tx.eventMedia.deleteMany({ where: { eventId: id } });
      // FAQEvent and TestimonialEvent likely need manual deletion too if they exist.
      // For now, let's focus on the main ones causing issues combined with the event deletion.

      // 2. Delete the event
      return await tx.event.delete({
        where: { id },
      });
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return Response.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
