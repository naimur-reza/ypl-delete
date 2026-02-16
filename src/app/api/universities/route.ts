import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handleGetMany,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "@/lib/api-helpers";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.university, {
    searchFields: ["name", "slug"],
    defaultSort: { createdAt: "desc" },
    include: {
      countries: { include: { country: true } },
      destination: true,
      detail: true,
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
    isGlobal,
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
    rankingNumber,
    costOfStudying,
  } = body;

  if (!name || !slug || !destinationId || (!isGlobal && (!countryIds || !countryIds.length))) {
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
      isGlobal: isGlobal || false,
      website,
      address,
      phone,
      email,
      destinationId,
      metaTitle,
      metaDescription,
      metaKeywords,
      status: status || "DRAFT",
      rankingNumber: body.rankingNumber,
      costOfStudying: body.costOfStudying,
      countries: countryIds?.length
        ? {
            create: (countryIds as string[]).map((cid) => ({ countryId: cid })),
          }
        : undefined,
      detail: {
        create: {
          overview: body.overview || "",
          entryRequirements: body.entryRequirements || "",
          ranking: body.ranking || null,
          tuitionFees: body.tuitionFees || null,
          famousFor: body.famousFor || null,
          servicesHeading: body.servicesHeading || null,
          servicesDescription: body.servicesDescription || null,
          servicesImage: body.servicesImage || null,
          accommodation: body.accommodation || null,
          accommodationImage: body.accommodationImage || null,
          description: body.description || null,
        },
      },
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
  const {
    id,
    countryIds,
    rankingNumber,
    costOfStudying,
    destinationId,
    // Destructure detail fields to exclude them from ...data
    overview,
    entryRequirements,
    ranking,
    tuitionFees,
    famousFor,
    servicesHeading,
    servicesDescription,
    servicesImage,
    accommodation,
    accommodationImage,
    description,
    ...data
  } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  // updateData should only contain fields defined in the University model
  const updateData: Record<string, unknown> = { ...data };
  if (rankingNumber !== undefined) updateData.rankingNumber = rankingNumber;
  if (costOfStudying !== undefined) updateData.costOfStudying = costOfStudying;
  if (description !== undefined) updateData.description = description;

  // Handle destinationId - use connect syntax for Prisma
  if (destinationId) {
    updateData.destination = { connect: { id: destinationId } };
  }

  if (countryIds) {
    updateData.countries = {
      deleteMany: {},
      create: (countryIds as string[]).map((cid) => ({ countryId: cid })),
    };
  }

  // Handle nested detail update/create
  const detailData = {
    overview: overview || "",
    entryRequirements: entryRequirements || "",
    ranking: ranking || null,
    tuitionFees: tuitionFees || null,
    famousFor: famousFor || null,
    servicesHeading: servicesHeading || null,
    servicesDescription: servicesDescription || null,
    servicesImage: servicesImage || null,
    accommodation: accommodation || null,
    accommodationImage: accommodationImage || null,
    description: description || null,
  };

  updateData.detail = {
    upsert: {
      create: detailData,
      update: detailData,
    },
  };

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
