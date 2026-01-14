import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    return await handleGetMany(req, prisma.globalOffice as any, {
      searchFields: ["name", "slug", "subtitle"],
      defaultSort: { createdAt: "desc" },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });
  } catch (error: any) {
    console.error("DEBUG: API GET /api/global-offices failed:", error);
    return Response.json(
      { error: "Internal Server Error", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    name,
    subtitle,
    slug,
    email,
    phone,
    address,
    mapUrl,
    content,
    image,
    bannerImage,
    openingHours,
    countryIds,
    metaTitle,
    metaDescription,
    metaKeywords,
    status,
  } = body;

  if (!name || !slug) {
    return Response.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  try {
    const globalOffice = await prisma.globalOffice.create({
      data: {
        name,
        subtitle,
        slug,
        email,
        phone,
        address,
        mapUrl,
        content,
        image,
        bannerImage,
        openingHours,
        metaTitle,
        metaDescription,
        metaKeywords,
        status: status || "DRAFT",
        countries: {
          create:
            countryIds?.map((countryId: string) => ({
              countryId,
            })) || [],
        },
      },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    return Response.json(globalOffice, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return Response.json(
        { error: "A global office with this slug already exists" },
        { status: 400 }
      );
    }
    return Response.json(
      { error: error.message || "Failed to create global office" },
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

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // First, delete existing country relations
    await prisma.globalOfficeCountry.deleteMany({
      where: { globalOfficeId: id },
    });

    // Update the global office and create new country relations
    const globalOffice = await prisma.globalOffice.update({
      where: { id },
      data: {
        ...data,
        countries: {
          create:
            countryIds?.map((countryId: string) => ({
              countryId,
            })) || [],
        },
      },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    return Response.json(globalOffice);
  } catch (error: any) {
    if (error instanceof Error) {
      return Response.json(
        { error: error.message || "Failed to update global office" },
        { status: 500 }
      );
    }
    return Response.json(
      { error: "Failed to update global office" },
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

  return handleDelete(id, prisma.globalOffice as any, {
    revalidatePaths: ["/dashboard/global-offices"],
  });
}
