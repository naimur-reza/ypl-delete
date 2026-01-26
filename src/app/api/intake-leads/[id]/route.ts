"use server";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const intakeLead = await prisma.intakeLead.findUnique({
      where: { id },
      include: {
        intakePage: {
          select: {
            id: true,
            intake: true,
            destination: { select: { id: true, name: true, slug: true } },
          },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!intakeLead) {
      return Response.json({ error: "Intake lead not found" }, { status: 404 });
    }

    return Response.json(intakeLead);
  } catch (error) {
    console.error("Error fetching intake lead:", error);
    return Response.json(
      { error: "Failed to fetch intake lead" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const updated = await prisma.intakeLead.update({
      where: { id },
      data: body,
      include: {
        intakePage: {
          select: {
            id: true,
            intake: true,
            destination: { select: { id: true, name: true, slug: true } },
          },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating intake lead:", error);
    return Response.json(
      { error: "Failed to update intake lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.intakeLead.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting intake lead:", error);
    return Response.json(
      { error: "Failed to delete intake lead" },
      { status: 500 }
    );
  }
}
