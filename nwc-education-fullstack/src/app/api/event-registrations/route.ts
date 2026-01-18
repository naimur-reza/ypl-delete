"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  return handleGetMany(req, prisma.eventRegistration, {
    searchFields: ["name", "email", "phone"],
    defaultSort: { createdAt: "desc" },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          startDate: true,
        },
      },
      country: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

export async function POST(req: NextRequest) {
  // Public action: Anyone can register for an event
  const body = await req.json();
  const {
    eventId,
    countryId,
    name,
    email,
    phone,
    city,
    addressCountry,
    studyDestination,
    lastQualification,
    englishTest,
    englishTestScore,
    additionalInfo,
    notes,
    status,
  } = body;

  if (!eventId || !name) {
    return Response.json(
      { error: "eventId and name are required" },
      { status: 400 }
    );
  }

  try {
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        countryId: countryId || null,
        name,
        email,
        phone,
        city: city || null,
        addressCountry: addressCountry || null,
        studyDestination: studyDestination || null,
        lastQualification: lastQualification || null,
        englishTest: englishTest || null,
        englishTestScore: englishTestScore || null,
        additionalInfo: additionalInfo || null,
        notes,
        status,
      },
      include: {
        event: {
          select: { id: true, title: true, slug: true, startDate: true },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    return Response.json(registration, { status: 201 });
  } catch (error) {
    console.error("Error creating event registration:", error);
    return Response.json(
      { error: "Failed to create event registration" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const updated = await prisma.eventRegistration.update({
      where: { id },
      data,
      include: {
        event: {
          select: { id: true, title: true, slug: true, startDate: true },
        },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating event registration:", error);
    return Response.json(
      { error: "Failed to update event registration" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  try {
    await prisma.eventRegistration.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting event registration:", error);
    return Response.json(
      { error: "Failed to delete event registration" },
      { status: 500 }
    );
  }
}
