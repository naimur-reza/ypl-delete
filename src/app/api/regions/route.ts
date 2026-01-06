import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handleGetMany,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.country, {
    searchFields: ["name", "slug"],
    defaultSort: { createdAt: "desc" },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, metaTitle, metaDescription, metaKeywords } = body;

  if (!name || !slug) {
    return Response.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  return handleCreate(
    { name, slug, metaTitle, metaDescription, metaKeywords },
    prisma.country,
    {
      uniqueField: "slug",
      revalidatePaths: ["/dashboard/countries"],
    }
  );
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  return handleUpdate(id, data, prisma.country, {
    revalidatePaths: ["/dashboard/countries"],
  });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  return handleDelete(id, prisma.country, {
    revalidatePaths: ["/dashboard/countries"],
  });
}
