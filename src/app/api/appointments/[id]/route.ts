"use server";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const { id } = await params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        event: {
          select: { id: true, title: true, slug: true, startDate: true },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!appointment) {
      return Response.json({ error: "Appointment not found" }, { status: 404 });
    }

    return Response.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return Response.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const { id } = await params;
  const body = await req.json();
  const { preferredAt, ...data } = body;

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        ...(preferredAt !== undefined && {
          preferredAt: preferredAt ? new Date(preferredAt) : null,
        }),
      },
      include: {
        event: {
          select: { id: true, title: true, slug: true, startDate: true },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return Response.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const { id } = await params;

  try {
    await prisma.appointment.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return Response.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
