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
    isActive,
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
  } = body;

  if (!title || !slug || !destinationId) {
    return Response.json(
      { error: "Title, slug, and destinationId are required" },
      { status: 400 }
    );
  }

  return handleCreate(
    {
      title,
      slug,
      description,
      summary,
      image: image || null,
      isActive: isActive ?? true,
      amount: amount ? parseFloat(amount) : null,
      eligibility,
      deadline: deadline ? new Date(deadline) : null,
      universityId: universityId || null,
      destinationId,
      metaTitle,
      metaDescription,
      metaKeywords,
      // Rich text fields
      overview: overview || null,
      benefits: benefits || null,
      eligibilityCriteria: eligibilityCriteria || null,
      levelAndField: levelAndField || null,
      providerInfo: providerInfo || null,
      requiredDocuments: requiredDocuments || null,
      howToApply: howToApply || null,
    },
    prisma.scholarship,
    {
      uniqueField: "slug",
      revalidatePaths: ["/dashboard/scholarships"],
    }
  );
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, ...data } = body;

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

  return handleUpdate(id, data, prisma.scholarship, {
    revalidatePaths: ["/dashboard/scholarships"],
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

  return handleDelete(id, prisma.scholarship, {
    revalidatePaths: ["/dashboard/scholarships"],
  });
}
