/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const countryId = url.searchParams.get("countryId");
  const countrySlug = url.searchParams.get("countrySlug");

  const where: any = {};
  if (countryId) {
    where.countries = { some: { countryId } };
  } else if (countrySlug) {
    where.countries = { some: { country: { slug: countrySlug } } };
  }

  return handleGetMany(req, prisma.destination, {
    searchFields: ["name", "slug"],
    where,
    defaultSort: { createdAt: "desc" },
    include: {
      countries: { include: { country: true } },
      sections: {
        orderBy: { displayOrder: "asc" },
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
    name,
    slug,
    countryIds,
    sections,
    metaTitle,
    metaDescription,
    metaKeywords,
    heroTitle,
    heroSubtitle,
    thumbnail,
    whyChoose,
    topUniversities,
    campusAndCommunity,
    destinationLife,
    status,
    isGlobal,
  } = body;

  // Allow global destinations without country IDs
  if (!name || !slug || (!isGlobal && !countryIds?.length)) {
    return Response.json(
      { error: "Name, slug and at least one country are required (unless Global)" },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.destination.create({
      data: {
        name,
        slug,
        metaTitle,
        metaDescription,
        metaKeywords,
        heroTitle,
        heroSubtitle,
        thumbnail,
        whyChoose,
        topUniversities,
        campusAndCommunity,
        destinationLife,
        status: status || "ACTIVE",
        isGlobal: isGlobal || false,
        countries:
          countryIds && Array.isArray(countryIds)
            ? {
                create: countryIds.map((cid: string) => ({ countryId: cid })),
              }
            : undefined,
        sections:
          sections && Array.isArray(sections) && sections.length > 0
            ? {
                create: sections.map((s: any, i: number) => ({
                  title: s.title,
                  slug: s.slug,
                  image: s.image || null,
                  content: s.content || null,
                  displayOrder: s.displayOrder ?? i,
                })),
              }
            : undefined,
      },
      include: {
        countries: { include: { country: true } },
        sections: { orderBy: { displayOrder: "asc" } },
      },
    });

    return Response.json(created, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { error: error.message || "Failed to create destination" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    id,
    countryIds,
    sections,
    name,
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
    heroTitle,
    heroSubtitle,
    thumbnail,
    whyChoose,
    topUniversities,
    campusAndCommunity,
    destinationLife,
    status,
    isGlobal,
  } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const dest = await tx.destination.update({
        where: { id },
        data: {
          name,
          slug,
          metaTitle,
          metaDescription,
          metaKeywords,
          heroTitle,
          heroSubtitle,
          thumbnail,
          whyChoose,
          topUniversities,
          campusAndCommunity,
          destinationLife,
          status,
          isGlobal: isGlobal ?? undefined,
        },
      });

      // Sync countries
      if (Array.isArray(countryIds)) {
        const existing = await tx.destinationCountry.findMany({
          where: { destinationId: id },
          select: { countryId: true },
        });
        const existingIds = new Set(existing.map((e) => e.countryId));

        const toCreate = countryIds.filter(
          (cid: string) => !existingIds.has(cid)
        );
        const toDelete = [...existingIds].filter(
          (cid) => !countryIds.includes(cid)
        );

        if (toCreate.length) {
          await tx.destinationCountry.createMany({
            data: toCreate.map((cid) => ({
              destinationId: id,
              countryId: cid,
            })),
            skipDuplicates: true,
          });
        }
        if (toDelete.length) {
          await tx.destinationCountry.deleteMany({
            where: { destinationId: id, countryId: { in: toDelete } },
          });
        }
      }

      // Sync sections
      if (Array.isArray(sections)) {
        // Get existing sections
        const existingSections = await tx.destinationSection.findMany({
          where: { destinationId: id },
          select: { id: true },
        });
        const existingSectionIds = new Set(existingSections.map((s) => s.id));

        // Separate into update vs create
        const toUpdate = sections.filter((s: any) => s.id && existingSectionIds.has(s.id));
        const toCreateSections = sections.filter((s: any) => !s.id);
        const incomingIds = new Set(sections.filter((s: any) => s.id).map((s: any) => s.id));
        const toDeleteSections = [...existingSectionIds].filter((sid) => !incomingIds.has(sid));

        // Delete removed sections
        if (toDeleteSections.length) {
          await tx.destinationSection.deleteMany({
            where: { id: { in: toDeleteSections } },
          });
        }

        // Update existing sections
        for (const s of toUpdate) {
          await tx.destinationSection.update({
            where: { id: s.id },
            data: {
              title: s.title,
              slug: s.slug,
              image: s.image || null,
              content: s.content || null,
              displayOrder: s.displayOrder,
            },
          });
        }

        // Create new sections
        if (toCreateSections.length) {
          await tx.destinationSection.createMany({
            data: toCreateSections.map((s: any, i: number) => ({
              destinationId: id,
              title: s.title,
              slug: s.slug,
              image: s.image || null,
              content: s.content || null,
              displayOrder: s.displayOrder ?? (toUpdate.length + i),
            })),
          });
        }
      }

      return dest;
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    // Fetch updated destination with sections
    const result = await prisma.destination.findUnique({
      where: { id },
      include: {
        countries: { include: { country: true } },
        sections: { orderBy: { displayOrder: "asc" } },
      },
    });

    return Response.json(result);
  } catch (error: any) {
    console.error("Update Destination Error:", error);
    return Response.json(
      { error: error.message || "Failed to update destination" },
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

  return handleDelete(id, prisma.destination, {
    revalidatePaths: ["/dashboard/destinations"],
  });
}
