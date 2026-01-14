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
  return handleGetMany(req, prisma.university, {
    searchFields: ["name", "slug"],
    defaultSort: { createdAt: "desc" },
    include: {
      countries: { include: { country: true } },
      destination: true,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    name,
    slug,
    logo,
    thumbnail,
    description,
    providerType,
    isFeatured,
    website,
    address,
    phone,
    email,
    countryIds,
    destinationId,
    metaTitle,
    metaDescription,
    metaKeywords,
    status,
  } = body;

  if (!name || !slug || !destinationId || !countryIds.length) {
    return Response.json(
      { error: "Name, slug, Countries Id and destinationId are required" },
      { status: 400 }
    );
  }

  return handleCreate(
    {
      name,
      slug,
      logo,
      thumbnail,
      description,
      providerType: providerType || "PRIVATE",
      isFeatured: isFeatured || false,
      website,
      address,
      phone,
      email,
      destinationId,
      metaTitle,
      metaDescription,
      metaKeywords,
      status: status || "DRAFT",
      countries: countryIds?.length
        ? {
            create: (countryIds as string[]).map((cid) => ({ countryId: cid })),
          }
        : undefined,
    } as unknown as Record<string, unknown>,
    prisma.university,
    {
      uniqueField: "slug",
      revalidatePaths: ["/dashboard/universities"],
    }
  );
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

  const updateData = { ...data };

  if (countryIds) {
    updateData.countries = {
      deleteMany: {},
      create: (countryIds as string[]).map((cid) => ({ countryId: cid })),
    };
  }

  return handleUpdate(id, updateData, prisma.university, {
    revalidatePaths: ["/dashboard/universities"],
  });
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

  return handleDelete(id, prisma.university, {
    revalidatePaths: ["/dashboard/universities"],
  });
}
