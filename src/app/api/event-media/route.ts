import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.eventMedia, {
    defaultSort: { sortOrder: "asc" },
    include: { event: true },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { eventId, mediaType, url, thumbnail, caption, sortOrder } = body;
  if (!eventId || !mediaType || !url) {
    return Response.json(
      { error: "eventId, mediaType, url are required" },
      { status: 400 }
    );
  }
  const created = await prisma.eventMedia.create({
    data: { eventId, mediaType, url, thumbnail, caption, sortOrder },
  });
  return Response.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });
  const updated = await prisma.eventMedia.update({ where: { id }, data });
  return Response.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });
  await prisma.eventMedia.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
