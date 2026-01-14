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
  return handleGetMany(req, prisma.career, {
    searchFields: ["title", "slug", "location", "jobType"],
    defaultSort: { createdAt: "desc" },
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
    location,
    jobType,
    description,
    requirements,
    applyUrl,
    status,
  } = body;

  if (!title || !slug)
    return Response.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );

  return handleCreate(
    {
      title,
      slug,
      location,
      jobType,
      description,
      requirements,
      applyUrl,
      status: status || "DRAFT",
    },
    prisma.career,
    { uniqueField: "slug", revalidatePaths: ["/dashboard/careers"] }
  );
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  return handleUpdate(id, data, prisma.career, {
    revalidatePaths: ["/dashboard/careers"],
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id } = body;

  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  return handleDelete(id, prisma.career, {
    revalidatePaths: ["/dashboard/careers"],
  });
}
