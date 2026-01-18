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
    const registration = await prisma.eventRegistration.findUnique({
      where: { id },
      include: {
        event: {
          select: { id: true, title: true, slug: true, startDate: true },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!registration) {
      return Response.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return Response.json(registration);
  } catch (error) {
    console.error("Error fetching registration:", error);
    return Response.json(
      { error: "Failed to fetch registration" },
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

  try {
    const updated = await prisma.eventRegistration.update({
      where: { id },
      data: body,
      include: {
        event: {
          select: { id: true, title: true, slug: true, startDate: true },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating registration:", error);
    return Response.json(
      { error: "Failed to update registration" },
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
    await prisma.eventRegistration.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return Response.json(
      { error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
