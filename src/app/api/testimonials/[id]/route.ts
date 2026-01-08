/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

// GET /api/testimonials/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        countries: { include: { country: true } },
        destinations: { include: { destination: true } },
        universities: { include: { university: true } },
        events: { include: { event: true } },
      },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials/[id]
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
      countryIds,
      destinationIds,
      universityIds,
      eventIds,
      order,
      rating,
      ...data
    } = body;

    const result = await prisma.$transaction(async (tx) => {
      // Delete existing associations
      await Promise.all([
        tx.testimonialCountry.deleteMany({ where: { testimonialId: id } }),
        tx.testimonialDestination.deleteMany({ where: { testimonialId: id } }),
        tx.testimonialUniversity.deleteMany({ where: { testimonialId: id } }),
        tx.testimonialEvent.deleteMany({ where: { testimonialId: id } }),
      ]);

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

      return testimonial;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error updating testimonial:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials/[id]
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

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
