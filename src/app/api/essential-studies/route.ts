/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.essentialStudy, {
    searchFields: ["title", "slug"],
    defaultSort: { createdAt: "desc" },
    include: { 
      destination: true,
      countries: {
        include: {
          country: true,
        },
      },
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, slug, description, content, destinationId, countryIds } = body;
  if (!title || !slug || !destinationId) {
    return Response.json(
      { error: "title, slug and destinationId are required" },
      { status: 400 }
    );
  }
  try {
    const created = await prisma.essentialStudy.create({
      data: { 
        title, 
        slug, 
        description, 
        content, 
        destinationId,
        countries: countryIds && countryIds.length > 0 ? {
          create: countryIds.map((countryId: string) => ({
            countryId,
          })),
        } : undefined,
      },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });
    return Response.json(created, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to create" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, countryIds, ...data } = body;
  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });
  try {
    const updated = await prisma.essentialStudy.update({ 
      where: { id }, 
      data: {
        ...data,
        countries: countryIds ? {
          deleteMany: {},
          create: countryIds.map((countryId: string) => ({
            countryId,
          })),
        } : undefined,
      },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });
    return Response.json(updated);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });
  try {
    await prisma.essentialStudy.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to delete" },
      { status: 500 }
    );
  }
}
