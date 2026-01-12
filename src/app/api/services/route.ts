/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handleGetMany,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.service, {
    searchFields: ["title", "slug"],
    defaultSort: { createdAt: "desc" },
    include: {
      countries: {
        include: {
          country: true,
        },
      },
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
    summary,
    content,
    image,
    metaTitle,
    metaDescription,
    metaKeywords,
    countryIds,
  } = body;

  if (!title || !slug) {
    return Response.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.service.create({
      data: {
        title,
        slug,
        summary,
        content,
        image,
        metaTitle,
        metaDescription,
        metaKeywords,
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
      { error: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, countryIds, ...data } = body;

  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  try {
    const updated = await prisma.service.update({
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
      { error: error.message || "Failed to update service" },
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

  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  return handleDelete(id, prisma.service, {
    revalidatePaths: ["/dashboard/services"],
  });
}
