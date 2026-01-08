import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.intakePage, {
    searchFields: ["title"],
    defaultSort: { updatedAt: "desc" },
    include: {
      destination: true,
      intakePageBenefits: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();
    const {
      destinationId,
      intake,
      title,
      description,
      heroMedia,
      eligibility,
      timelineJson,
      ctaLabel,
      ctaUrl,
      whyChooseTitle,
      whyChooseDescription,
      heroTitle,
      heroSubtitle,
      heroCTALabel,
      heroCTAUrl,
      metaTitle,
      metaDescription,
      metaKeywords,
      isActive,
      benefits,
    } = body;

    if (!destinationId || !intake || !title) {
      return Response.json(
        { error: "destinationId, intake, title are required" },
        { status: 400 }
      );
    }

    const created = await prisma.intakePage.create({
      data: {
        destinationId,
        intake,
        title,
        description,
        heroMedia,
        eligibility,
        timelineJson,
        ctaLabel,
        ctaUrl,
        whyChooseTitle,
        whyChooseDescription,
        heroTitle,
        heroSubtitle,
        heroCTALabel,
        heroCTAUrl,
        metaTitle,
        metaDescription,
        metaKeywords,
        isActive: isActive ?? true,
        intakePageBenefits: benefits?.length
          ? {
              create: benefits.map(
                (
                  b: {
                    title: string;
                    description?: string;
                    icon?: string;
                    sortOrder?: number;
                  },
                  index: number
                ) => ({
                  title: b.title,
                  description: b.description,
                  icon: b.icon,
                  sortOrder: b.sortOrder ?? index,
                })
              ),
            }
          : undefined,
      },
      include: { intakePageBenefits: true, destination: true },
    });

    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating intake page:", error);
    return Response.json(
      { error: "Failed to create intake page" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();
    const { id, benefits, ...data } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    // Delete existing benefits and recreate if provided
    if (benefits !== undefined) {
      await prisma.intakePageBenefit.deleteMany({
        where: { intakePageId: id },
      });
    }

    const updated = await prisma.intakePage.update({
      where: { id },
      data: {
        ...data,
        benefits:
          benefits !== undefined
            ? {
                create: benefits.map(
                  (
                    b: {
                      title: string;
                      description?: string;
                      icon?: string;
                      sortOrder?: number;
                    },
                    index: number
                  ) => ({
                    title: b.title,
                    description: b.description,
                    icon: b.icon,
                    sortOrder: b.sortOrder ?? index,
                  })
                ),
              }
            : undefined,
      },
      include: { intakePageBenefits: true, destination: true },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating intake page:", error);
    return Response.json(
      { error: "Failed to update intake page" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.intakePage.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting intake page:", error);
    return Response.json(
      { error: "Failed to delete intake page" },
      { status: 500 }
    );
  }
}
