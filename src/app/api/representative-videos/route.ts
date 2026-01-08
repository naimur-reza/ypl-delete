/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

// GET /api/representative-videos - Fetch all representative videos (testimonials with type REPRESENTATIVE)
export async function GET(req: NextRequest) {
  // Use handleGetMany but filter for REPRESENTATIVE type
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  const where: any = {
    type: "REPRESENTATIVE",
    mediaType: "VIDEO",
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [items, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          countries: { include: { country: true } },
          destinations: { include: { destination: true } },
          universities: { include: { university: true } },
          events: { include: { event: true } },
        },
      }),
      prisma.testimonial.count({ where }),
    ]);

    // Transform the data to match expected format
    const data = items.map((item) => ({
      id: item.id,
      title: item.name,
      url: item.videoUrl || "",
      thumbnail: item.avatar,
      countries: item.countries,
      destinations: item.destinations,
      universities: item.universities,
      events: item.events,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching representative videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch representative videos" },
      { status: 500 }
    );
  }
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

    return NextResponse.json(
      {
        id: testimonial.id,
        title: testimonial.name,
        url: testimonial.videoUrl,
        thumbnail: testimonial.avatar,
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
    return NextResponse.json(
      { error: "Failed to create representative video" },
      { status: 500 }
    );
  }
}
