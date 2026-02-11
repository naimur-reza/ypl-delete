import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.scholarship, {
    searchFields: ["title", "slug"],
    defaultSort: { createdAt: "desc" },
    include: {
      university: {
        select: {
          id: true,
          name: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
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
    description,
    summary,
    image,
    amount,
    eligibility,
    deadline,
    universityId,
    destinationId,
    metaTitle,
    metaDescription,
    metaKeywords,
    // Rich text fields
    overview,
    benefits,
    eligibilityCriteria,
    levelAndField,
    providerInfo,
    requiredDocuments,
    howToApply,
    status,
    countryIds,
    isGlobal,
  } = body;

  if (!title || !slug || !destinationId) {
    return Response.json(
      { error: "Title, slug, and destinationId are required" },
      { status: 400 },
    );
  }

  try {
    const scholarship = await prisma.scholarship.create({
      data: {
        title,
        slug,
        description,
        summary,
        image: image || null,
        status: status || "DRAFT",
        amount: amount ? parseFloat(amount) : null,
        deadline: deadline ? new Date(deadline) : null,
        universityId: universityId || null,
        destinationId,
        metaTitle,
        metaDescription,
        metaKeywords,
        overview: overview || null,
        benefits: benefits || null,
        eligibilityCriteria: eligibilityCriteria || null,
        levelAndField: levelAndField || null,
        providerInfo: providerInfo || null,
        requiredDocuments: requiredDocuments || null,
        howToApply: howToApply || null,
        isGlobal: isGlobal || false,
        countries: {
          create: (countryIds || []).map((countryId: string) => ({
            countryId,
          })),
        },
      },
      include: {
        countries: { include: { country: true } },
      },
    });

    return Response.json(scholarship, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return Response.json(
        { error: "A scholarship with this slug already exists" },
        { status: 400 },
      );
    }
    return Response.json(
      { error: error.message || "Failed to create scholarship" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, countryIds, isGlobal, ...data } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  // Handle date and number conversions
  if (data.deadline) {
    data.deadline = new Date(data.deadline);
  }
  if (data.amount !== undefined) {
    data.amount = data.amount ? parseFloat(data.amount) : null;
  }

  try {
    // Delete existing country associations and recreate
    await prisma.scholarshipCountry.deleteMany({
      where: { scholarshipId: id },
    });

    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: {
        ...data,
        isGlobal: isGlobal || false,
        countries: {
          create: (countryIds || []).map((countryId: string) => ({
            countryId,
          })),
        },
      },
      include: {
        countries: { include: { country: true } },
      },
    });

    return Response.json(scholarship);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to update scholarship" },
      { status: 500 },
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

  return handleDelete(id, prisma.scholarship, {
    revalidatePaths: ["/dashboard/scholarships"],
  });
}
