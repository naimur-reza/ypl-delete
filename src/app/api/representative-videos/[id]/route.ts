/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

// GET /api/representative-videos/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id, type: "REPRESENTATIVE" },
      include: {
        countries: { include: { country: true } },
        destinations: { include: { destination: true } },
        universities: { include: { university: true } },
        events: { include: { event: true } },
      },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Representative video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: testimonial.id,
      title: testimonial.name,
      url: testimonial.videoUrl,
      thumbnail: testimonial.avatar,
      countries: testimonial.countries,
      destinations: testimonial.destinations,
      universities: testimonial.universities,
      events: testimonial.events,
      createdAt: testimonial.createdAt,
    });
  } catch (error) {
    console.error("Error fetching representative video:", error);
    return NextResponse.json(
      { error: "Failed to fetch representative video" },
      { status: 500 }
    );
  }
}

// PUT /api/representative-videos/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const { id } = await params;
  try {
    const body = await request.json();
    const {
      title,
      url,
      thumbnail,
      countryIds,
      destinationIds,
      universityIds,
      eventIds,
    } = body;

    // Delete existing relations
    await Promise.all([
      prisma.testimonialCountry.deleteMany({ where: { testimonialId: id } }),
      prisma.testimonialDestination.deleteMany({
        where: { testimonialId: id },
      }),
      prisma.testimonialUniversity.deleteMany({
        where: { testimonialId: id },
      }),
      prisma.testimonialEvent.deleteMany({ where: { testimonialId: id } }),
    ]);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: title,
        videoUrl: url,
        avatar: thumbnail || null,
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

    return NextResponse.json({
      id: testimonial.id,
      title: testimonial.name,
      url: testimonial.videoUrl,
      thumbnail: testimonial.avatar,
      countries: testimonial.countries,
      destinations: testimonial.destinations,
      universities: testimonial.universities,
      events: testimonial.events,
      createdAt: testimonial.createdAt,
    });
  } catch (error: any) {
    console.error("Error updating representative video:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Representative video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update representative video" },
      { status: 500 }
    );
  }
}

// DELETE /api/representative-videos/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const { id } = await params;
  try {
    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Representative video deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting representative video:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Representative video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete representative video" },
      { status: 500 }
    );
  }
}
