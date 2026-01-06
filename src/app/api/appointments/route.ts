"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";

// Cast prisma to allow access to Appointment model even if generated types lag during edits

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.appointment, {
    searchFields: ["name", "email", "phone"],
    defaultSort: { createdAt: "desc" },
    include: {
      event: { select: { id: true, title: true, slug: true, startDate: true } },
      country: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { countryId, name, email, phone, notes, preferredAt, status, eventId } =
    body;

  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        countryId: countryId || null,
        eventId: eventId || null,
        name,
        email,
        phone,
        notes,
        preferredAt: preferredAt ? new Date(preferredAt) : null,
        status,
      },
      include: {
        event: {
          select: { id: true, title: true, slug: true, startDate: true },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    return Response.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return Response.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, preferredAt, ...data } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

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
