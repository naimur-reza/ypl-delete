/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handleGetMany,
  handleCreate,
} from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const where: any = {};
  if (type) {
    where.type = type;
  }

  return handleGetMany(req, prisma.gallery, {
    searchFields: ["title", "description"],
    defaultSort: { sortOrder: "asc" },
    where,
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
  const { title, description, image, type, sortOrder, isActive, countryIds = [] } = body;

  if (!title)
    return Response.json({ error: "Title is required" }, { status: 400 });
  if (!image)
    return Response.json({ error: "Image is required" }, { status: 400 });

  return handleCreate(
    {
      title,
      description,
      image,
      type: type || "VISA_SUCCESS",
      sortOrder: sortOrder || 0,
      isActive: isActive ?? true,
      countries: countryIds.length > 0 ? {
        create: countryIds.map((countryId: string) => ({
          country: {
            connect: { id: countryId },
          },
        })),
      } : undefined,
    },
    prisma.gallery,
    {
      revalidatePaths: ["/dashboard/gallery"],
    }
  );
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, countryIds = [], ...data } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Update gallery basic fields
      const gallery = await tx.gallery.update({
        where: { id },
        data,
      });

      // 2️⃣ Remove existing country relations
      await tx.galleryCountry.deleteMany({
        where: { galleryId: id },
      });

      // 3️⃣ Re-create relations (if any)
      if (countryIds.length > 0) {
        await tx.galleryCountry.createMany({
          data: countryIds.map((countryId: string) => ({
            galleryId: id,
            countryId,
          })),
          skipDuplicates: true,
        });
      }

      return gallery;
    });

    return Response.json(result);
  } catch (error) {
    console.error("Update gallery failed:", error);
    return Response.json(
      { error: "Failed to update gallery" },
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

  try {
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Delete join table relations
      await tx.galleryCountry.deleteMany({
        where: { galleryId: id },
      });

      // 2️⃣ Delete the gallery
      await tx.gallery.delete({
        where: { id },
      });
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete gallery failed:", error);
    return Response.json(
      { error: "Failed to delete gallery" },
      { status: 500 }
    );
  }
}
