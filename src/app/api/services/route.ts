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
  return handleGetMany(req, prisma.service, {
    searchFields: ["title", "slug"],
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
    summary,
    content,
    image,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = body;

  if (!title || !slug) {
    return Response.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );
  }

  return handleCreate(
    {
      title,
      slug,
      summary,
      content,
      image,
      metaTitle,
      metaDescription,
      metaKeywords,
    },
    prisma.service,
    { uniqueField: "slug", revalidatePaths: ["/dashboard/services"] }
  );
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  return handleUpdate(id, data, prisma.service, {
    revalidatePaths: ["/dashboard/services"],
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id } = body;

  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  return handleDelete(id, prisma.service, {
    revalidatePaths: ["/dashboard/services"],
  });
}
