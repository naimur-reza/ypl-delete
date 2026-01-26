"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  // Search
  const search = searchParams.get("search") || "";

  // Date range filtering
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Status filter
  const status = searchParams.get("status");

  // Sorting
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  try {
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { intakeName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.intakeLead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
      }),
      prisma.intakeLead.count({ where }),
    ]);

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching intake leads:", error);
    return Response.json(
      { error: "Failed to fetch intake leads" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    intakePageId,
    intakeName,
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
  } = body;

  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }

  if (!intakeName) {
    return Response.json({ error: "intakeName is required" }, { status: 400 });
  }

  try {
    const intakeLead = await prisma.intakeLead.create({
      data: {
        intakePageId: intakePageId || null,
        intakeName,
        countryId: countryId || null,
        name,
        email: email || null,
        phone: phone || null,
        city: city || null,
        addressCountry: addressCountry || null,
        studyDestination: studyDestination || null,
        lastQualification: lastQualification || null,
        englishTest: englishTest || null,
        englishTestScore: englishTestScore || null,
        additionalInfo: additionalInfo || null,
        notes: notes || null,
      },
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

    return Response.json(intakeLead, { status: 201 });
  } catch (error) {
    console.error("Error creating intake lead:", error);
    return Response.json(
      { error: "Failed to create intake lead" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const updated = await prisma.intakeLead.update({
      where: { id },
      data,
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

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

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
