import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handleCreate,
  handleDelete,
  handleGetMany,
  handleUpdate,
} from "@/lib/api-helpers";

const revalidatePaths = ["/dashboard/university-details"];

export async function GET(req: NextRequest) {
  const universityId = req.nextUrl.searchParams.get("universityId") || undefined;

  return handleGetMany(req, prisma.universityDetail, {
    where: universityId ? { universityId } : undefined,
    include: { university: true },
    defaultSort: { createdAt: "desc" },
    searchFields: ["overview", "ranking", "tuitionFees", "famousFor"],
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data?.universityId) {
    return Response.json(
      { error: "universityId is required" },
      { status: 400 }
    );
  }

  return handleCreate(data, prisma.universityDetail, {
    uniqueField: "universityId",
    revalidatePaths,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  return handleUpdate(id, data, prisma.universityDetail, { revalidatePaths });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  return handleDelete(id, prisma.universityDetail, { revalidatePaths });
}
