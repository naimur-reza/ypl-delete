/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

// This API route is kept for backward compatibility and specialized use
// It now uses the unified Testimonial model but defaults to GMB type
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  return handleGetMany(req, prisma.testimonial, {
    searchFields: ["name", "content"],
    defaultSort: { order: "asc" }, // or createdAt
    include: {
      countries: { include: { country: true } },
      destinations: { include: { destination: true } },
      universities: { include: { university: true } },
     // GMB usually not linked to events, but could be
    },
    // Filter to only GMB reviews
    where: { type: "GMB" },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    author,
    rating,
    content,
    url,
    publishedAt, // Testimonial doesn't have publishedAt, mapping to default logic or ignoring
    countryId,
    destinationId,
  } = body;

  /*
    Mapping rules:
    author -> name
    content -> content
    rating -> rating
    url -> url
    publishedAt -> Not supported in new model directly (we have createdAt), 
                   but maybe we should used created/updated or just ignore. 
                   Existing 'testimonial.prisma' does not have publishedAt. 
                   If critical, I should have added it. Assuming ignore for now.
    countryId -> countries (single item)
    destinationId -> destinations (single item)
  */

  const testimonialData = {
    type: "GMB" as const,
    mediaType: "TEXT_ONLY" as const,
    name: author || "Unknown",
    content: content || "",
    rating: rating ? Number(rating) : undefined,
    url: url || null,
    // publishedAt ignored
  };

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        ...testimonialData,
        countries: countryId ? { create: [{ countryId }] } : undefined,
        destinations: destinationId ? { create: [{ destinationId }] } : undefined,
      },
      include: {
        countries: { include: { country: true } },
        destinations: { include: { destination: true } },
      },
    });

    return Response.json(testimonial, { status: 201 });
  } catch (error: any) {
    console.error("Error creating GMB review:", error);
    return Response.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// Implement PUT/DELETE if needed, similar to Testimonials API but enforcing type=GMB logic or just delegation
// For now, simpler to just use generic DELETE
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id } = body;
  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });
  return handleDelete(id, prisma.testimonial, {
    revalidatePaths: ["/dashboard/gmb-reviews", "/dashboard/testimonials"],
  });
}
