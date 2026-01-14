/* eslint-disable @typescript-eslint/no-explicit-any */
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
  return handleGetMany(req, prisma.accreditation, {
    searchFields: ["name"],
    defaultSort: { sortOrder: "asc" },
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
  const { name, logo, website, type, sortOrder, countryIds, status } = body;

  if (!name)
    return Response.json({ error: "Name is required" }, { status: 400 });

  return handleCreate(
    {
      name,
      logo,
      website,
      type: type || "NEWS",
      sortOrder,
      status: status || "DRAFT",
      countries: {
        create: countryIds.map((countryId: string) => ({
          country: {
            connect: { id: countryId },
          },
        })),
      },
    },
    prisma.accreditation,
    {
      revalidatePaths: ["/dashboard/accreditations"],
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
      // 1️⃣ Update accreditation basic fields
      const accreditation = await tx.accreditation.update({
        where: { id },
        data,
      });

      // 2️⃣ Remove existing country relations
      await tx.accreditationCountry.deleteMany({
        where: { accreditationId: id },
      });

      // 3️⃣ Re-create relations (if any)
      if (countryIds.length > 0) {
        await tx.accreditationCountry.createMany({
          data: countryIds.map((countryId: string) => ({
            accreditationId: id,
            countryId,
          })),
          skipDuplicates: true, // safety
        });
      }

      return accreditation;
    });

    return Response.json(result);
  } catch (error) {
    console.error("Update accreditation failed:", error);
    return Response.json(
      { error: "Failed to update accreditation" },
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
      // 1️⃣ Delete join table relations (explicit)
      await tx.accreditationCountry.deleteMany({
        where: { accreditationId: id },
      });

      // 2️⃣ Delete the accreditation
      await tx.accreditation.delete({
        where: { id },
      });
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete accreditation failed:", error);
    return Response.json(
      { error: "Failed to delete accreditation" },
      { status: 500 }
    );
  }
}
