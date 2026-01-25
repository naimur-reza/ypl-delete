import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const destinationId = req.nextUrl.searchParams.get("destinationId") || undefined;
  const where = destinationId ? { destinationId } : {};
  return handleGetMany(req, prisma.intakeSeason, {
    where,
    searchFields: ["title", "subtitle"],
    defaultSort: { updatedAt: "desc" },
    include: {
      countries: { include: { country: true } },
      destination: { select: { id: true, name: true, slug: true } },
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
      title,
      subtitle,
      description,
      intake,
      year,
      backgroundImage,
      ctaLabel,
      ctaUrl,
      status,
      applicationDeadline,
      intakeStartDate,
      countryIds,
      destinationId,
      isGlobal,
    } = body;

    if (!title || !intake || !year) {
      return Response.json(
        { error: "title, intake, and year are required" },
        { status: 400 }
      );
    }

    if (destinationId) {
      const dest = await prisma.destination.findUnique({
        where: { id: destinationId },
      });
      if (!dest) {
        return Response.json(
          { error: "Destination not found" },
          { status: 400 }
        );
      }
    }

    // If setting this as active and has countries, deactivate other active seasons for same countries
    if (status === "ACTIVE" && countryIds?.length) {
      // Find seasons that have any of the same countries and are active
      const overlappingSeasons = await prisma.intakeSeason.findMany({
        where: {
          status: "ACTIVE",
          countries: {
            some: {
              countryId: { in: countryIds },
            },
          },
        },
        select: { id: true },
      });

      if (overlappingSeasons.length > 0) {
        await prisma.intakeSeason.updateMany({
          where: { id: { in: overlappingSeasons.map(s => s.id) } },
          data: { status: "DRAFT" },
        });
      }
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
        applicationDeadline: applicationDeadline
          ? new Date(applicationDeadline)
          : null,
        intakeStartDate: intakeStartDate ? new Date(intakeStartDate) : null,
        status: status || "DRAFT",
        isGlobal: isGlobal ?? false,
        destinationId: destinationId || null,
        countries: countryIds?.length
          ? {
            create: countryIds.map((countryId: string) => ({ countryId })),
          }
          : undefined,
      },
      include: {
        countries: { include: { country: true } },
        destination: { select: { id: true, name: true, slug: true } },
      },
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
      status,
      applicationDeadline,
      intakeStartDate,
      countryIds,
      destinationId,
      isGlobal,
    } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    if (destinationId) {
      const dest = await prisma.destination.findUnique({
        where: { id: destinationId },
      });
      if (!dest) {
        return Response.json(
          { error: "Destination not found" },
          { status: 400 }
        );
      }
    }

    // If setting this as active, deactivate other active seasons for same countries
    if (status === "ACTIVE") {
      // Get the country IDs to check - either from request or fetch existing
      let targetCountryIds = countryIds;

      if (!targetCountryIds) {
        // Fetch existing countries for this season
        const existing = await prisma.intakeSeason.findUnique({
          where: { id },
          include: { countries: { select: { countryId: true } } },
        });
        targetCountryIds = existing?.countries.map(c => c.countryId) || [];
      }

      if (targetCountryIds.length > 0) {
        // Find seasons (excluding this one) that have any of the same countries and are active
        const overlappingSeasons = await prisma.intakeSeason.findMany({
          where: {
            id: { not: id },
            status: "ACTIVE",
            countries: {
              some: {
                countryId: { in: targetCountryIds },
              },
            },
          },
          select: { id: true },
        });

        if (overlappingSeasons.length > 0) {
          await prisma.intakeSeason.updateMany({
            where: { id: { in: overlappingSeasons.map(s => s.id) } },
            data: { status: "DRAFT" },
          });
        }
      }
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
        // Only update dates if explicitly provided (not undefined)
        ...(applicationDeadline !== undefined && {
          applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        }),
        ...(intakeStartDate !== undefined && {
          intakeStartDate: intakeStartDate ? new Date(intakeStartDate) : null,
        }),
        // Status should update even if empty string (to allow clearing)
        ...(status !== undefined && { status }),
        ...(destinationId !== undefined && {
          destinationId: destinationId || null,
        }),
        isGlobal: isGlobal !== undefined ? isGlobal : undefined,
        countries:
          countryIds !== undefined
            ? {
              create: countryIds.map((countryId: string) => ({ countryId })),
            }
            : undefined,
      },
      include: {
        countries: { include: { country: true } },
        destination: { select: { id: true, name: true, slug: true } },
      },
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
