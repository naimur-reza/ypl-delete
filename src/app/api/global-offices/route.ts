import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.globalOffice, {
    searchFields: ["name", "slug", "subtitle"],
    defaultSort: { createdAt: "desc" },
    include: {
      countries: {
        include: {
          country: true,
        },
      },
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    name,
    subtitle,
    slug,
    email,
    phone,
    address,
    latitude,
    longitude,
    mapEmbedUrl,
    openingHours,
    content,
    countryIds,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = body;

  if (!name || !slug) {
    return Response.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  // Validate and convert latitude
  let latitudeValue: number | null = null;
  if (latitude !== null && latitude !== undefined && latitude !== "") {
    const latNum =
      typeof latitude === "string" ? parseFloat(latitude) : latitude;
    if (isNaN(latNum)) {
      return Response.json(
        { error: "Latitude must be a valid number" },
        { status: 400 }
      );
    }
    if (latNum < -90 || latNum > 90) {
      return Response.json(
        { error: "Latitude must be between -90 and 90" },
        { status: 400 }
      );
    }
    latitudeValue = latNum;
  }

  // Validate and convert longitude
  let longitudeValue: number | null = null;
  if (longitude !== null && longitude !== undefined && longitude !== "") {
    const lngNum =
      typeof longitude === "string" ? parseFloat(longitude) : longitude;
    if (isNaN(lngNum)) {
      return Response.json(
        { error: "Longitude must be a valid number" },
        { status: 400 }
      );
    }
    if (lngNum < -180 || lngNum > 180) {
      return Response.json(
        { error: "Longitude must be between -180 and 180" },
        { status: 400 }
      );
    }
    longitudeValue = lngNum;
  }

  try {
    const globalOffice = await prisma.globalOffice.create({
      data: {
        name,
        subtitle,
        slug,
        email,
        phone,
        address,
        latitude: latitudeValue,
        longitude: longitudeValue,
        mapEmbedUrl,
        openingHours,
        content,
        metaTitle,
        metaDescription,
        metaKeywords,
        countries: {
          create:
            countryIds?.map((countryId: string) => ({
              countryId,
            })) || [],
        },
      },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    return Response.json(globalOffice, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2002") {
      return Response.json(
        { error: "A global office with this slug already exists" },
        { status: 400 }
      );
    }
    return Response.json(
      { error: error.message || "Failed to create global office" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, countryIds, latitude, longitude, ...data } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  // Validate and convert latitude
  let latitudeValue: number | null = null;
  if (latitude !== null && latitude !== undefined && latitude !== "") {
    const latNum =
      typeof latitude === "string" ? parseFloat(latitude) : latitude;
    if (isNaN(latNum)) {
      return Response.json(
        { error: "Latitude must be a valid number" },
        { status: 400 }
      );
    }
    if (latNum < -90 || latNum > 90) {
      return Response.json(
        { error: "Latitude must be between -90 and 90" },
        { status: 400 }
      );
    }
    latitudeValue = latNum;
  }

  // Validate and convert longitude
  let longitudeValue: number | null = null;
  if (longitude !== null && longitude !== undefined && longitude !== "") {
    const lngNum =
      typeof longitude === "string" ? parseFloat(longitude) : longitude;
    if (isNaN(lngNum)) {
      return Response.json(
        { error: "Longitude must be a valid number" },
        { status: 400 }
      );
    }
    if (lngNum < -180 || lngNum > 180) {
      return Response.json(
        { error: "Longitude must be between -180 and 180" },
        { status: 400 }
      );
    }
    longitudeValue = lngNum;
  }

  try {
    // First, delete existing country relations
    await prisma.globalOfficeCountry.deleteMany({
      where: { globalOfficeId: id },
    });

    // Update the global office and create new country relations
    const globalOffice = await prisma.globalOffice.update({
      where: { id },
      data: {
        ...data,
        latitude: latitudeValue,
        longitude: longitudeValue,
        countries: {
          create:
            countryIds?.map((countryId: string) => ({
              countryId,
            })) || [],
        },
      },
      include: {
        countries: {
          include: {
            country: true,
          },
        },
      },
    });

    return Response.json(globalOffice);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json(
        { error: error.message || "Failed to update global office" },
        { status: 500 }
      );
    }
    return Response.json(
      { error: "Failed to update global office" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  return handleDelete(id, prisma.globalOffice, {
    revalidatePaths: ["/dashboard/global-offices"],
  });
}
