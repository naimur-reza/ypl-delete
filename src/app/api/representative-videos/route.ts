/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleCreate } from "@/lib/api-helpers";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

// GET /api/representative-videos - Fetch all representative videos (testimonials with type REPRESENTATIVE)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");

  const where: any = {
    type: "REPRESENTATIVE",
    mediaType: "VIDEO",
  };

  if (status && status !== "all") {
    where.status = status;
  }

  return handleGetMany(req, prisma.testimonial, {
    where,
    searchFields: ["name", "content"],
    defaultSort: { order: "asc" },
    include: {
      countries: { include: { country: true } },
      destinations: { include: { destination: true } },
      universities: { include: { university: true } },
      events: { include: { event: true } },
    },
    transform: (item: any) => ({
      id: item.id,
      title: item.name,
      url: item.videoUrl || "",
      thumbnail: item.avatar,
      status: item.status,
      countries: item.countries,
      destinations: item.destinations,
      universities: item.universities,
      events: item.events,
      createdAt: item.createdAt,
    }),
  } as any);
}

// POST /api/representative-videos - Create new representative video
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();
    const {
      title,
      url,
      thumbnail,
      status,
      countryIds,
      destinationIds,
      universityIds,
      eventIds,
    } = body;

    const testimonial = await prisma.testimonial.create({
      data: {
        type: "REPRESENTATIVE",
        mediaType: "VIDEO",
        name: title,
        videoUrl: url,
        avatar: thumbnail || null,
        status: status || "DRAFT",
        order: 0,
        countries: countryIds?.length
          ? {
              create: countryIds.map((countryId: string) => ({
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
        universities: universityIds?.length
          ? {
              create: universityIds.map((universityId: string) => ({
                universityId,
              })),
            }
          : undefined,
        events: eventIds?.length
          ? {
              create: eventIds.map((eventId: string) => ({
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

    return Response.json(
      {
        id: testimonial.id,
        title: testimonial.name,
        url: testimonial.videoUrl,
        thumbnail: testimonial.avatar,
        status: testimonial.status,
        countries: testimonial.countries,
        destinations: testimonial.destinations,
        universities: testimonial.universities,
        events: testimonial.events,
        createdAt: testimonial.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating representative video:", error);
    return Response.json(
      { error: "Failed to create representative video" },
      { status: 500 }
    );
  }
}
