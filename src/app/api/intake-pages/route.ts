import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import {
  createIntakePage,
  updateIntakePage,
  deleteIntakePage,
} from "@/lib/intake-actions-logic";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.intakePage, {
    searchFields: [],
    defaultSort: { updatedAt: "desc" },
    include: {
      destination: true,
      countries: { include: { country: true } },
      topUniversities: { include: { university: true } },
      intakePageBenefits: { orderBy: { sortOrder: "asc" } },
      howWeHelpItems: { orderBy: { sortOrder: "asc" } },
      intakeSeason: true,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();
    const created = await createIntakePage(body);
    return Response.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error creating intake page:", error);
    return Response.json(
      { error: error.message || "Failed to create intake page" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await updateIntakePage(id, data);
    return Response.json(updated);
  } catch (error: any) {
    console.error("Error updating intake page:", error);
    return Response.json(
      { error: error.message || "Failed to update intake page" },
      { status: 500 },
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
    await deleteIntakePage(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting intake page:", error);
    return Response.json(
      { error: error.message || "Failed to delete intake page" },
      { status: 500 },
    );
  }
}
