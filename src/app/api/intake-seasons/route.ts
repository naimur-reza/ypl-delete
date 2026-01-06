import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.intakeSeason, {
    searchFields: ["title", "subtitle"],
    defaultSort: { updatedAt: "desc" },
    include: { countries: { include: { country: true } } },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      intake,
      year,
      backgroundImage,
      ctaLabel,
      ctaUrl,
      isActive,
      applicationDeadline,
      intakeStartDate,
      countryIds,
    } = body;

    if (!title || !intake || !year) {
      return Response.json(
        { error: "title, intake, and year are required" },
        { status: 400 }
      );
    }

    // If setting this as active, deactivate all others first
    if (isActive) {
      await prisma.intakeSeason.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const created = await prisma.intakeSeason.create({
      data: {
        title,
        subtitle,
        description,
        intake,
        year: parseInt(year),
        backgroundImage,
        ctaLabel,
        ctaUrl,
        isActive: isActive || false,
        applicationDeadline: applicationDeadline
          ? new Date(applicationDeadline)
          : null,
        intakeStartDate: intakeStartDate ? new Date(intakeStartDate) : null,
        countries: countryIds?.length
          ? {
              create: countryIds.map((countryId: string) => ({ countryId })),
            }
          : undefined,
      },
      include: { countries: { include: { country: true } } },
    });

    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating intake season:", error);
    return Response.json(
      { error: "Failed to create intake season" },
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
    const {
      id,
      title,
      subtitle,
      description,
      intake,
      year,
      backgroundImage,
      ctaLabel,
      ctaUrl,
      isActive,
      applicationDeadline,
      intakeStartDate,
      countryIds,
    } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    // If setting this as active, deactivate all others first
    if (isActive) {
      await prisma.intakeSeason.updateMany({
        where: { isActive: true, NOT: { id } },
        data: { isActive: false },
      });
    }

    // Delete existing country relations and recreate
    if (countryIds !== undefined) {
      await prisma.intakeSeasonCountry.deleteMany({
        where: { intakeSeasonId: id },
      });
    }

    const updated = await prisma.intakeSeason.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        intake,
        year: year ? parseInt(year) : undefined,
        backgroundImage,
        ctaLabel,
        ctaUrl,
        isActive,
        applicationDeadline: applicationDeadline
          ? new Date(applicationDeadline)
          : null,
        intakeStartDate: intakeStartDate ? new Date(intakeStartDate) : null,
        countries:
          countryIds !== undefined
            ? {
                create: countryIds.map((countryId: string) => ({ countryId })),
              }
            : undefined,
      },
      include: { countries: { include: { country: true } } },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating intake season:", error);
    return Response.json(
      { error: "Failed to update intake season" },
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

    await prisma.intakeSeason.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting intake season:", error);
    return Response.json(
      { error: "Failed to delete intake season" },
      { status: 500 }
    );
  }
}
