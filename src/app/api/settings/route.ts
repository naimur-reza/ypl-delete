import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { settingsSchema, footerSettingsSchema } from "@/schemas/settings";
import { Prisma } from "../../../../prisma/src/generated/prisma/client";

// GET: Fetch settings by key
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return Response.json(
        { error: "Key parameter is required" },
        { status: 400 }
      );
    }

    const settings = await prisma.settings.findUnique({
      where: { key },
    });

    if (!settings) {
      return Response.json({ data: null }, { status: 200 });
    }

    return Response.json({ data: settings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST: Create settings (admin only)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();

    // Validate the settings data
    const validationResult = settingsSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        {
          error: "Invalid settings data",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { key, ...settingsData } = validationResult.data;

    // Check if settings with this key already exists
    const existing = await prisma.settings.findUnique({
      where: { key },
    });

    if (existing) {
      return Response.json(
        {
          error: `Settings with key "${key}" already exists. Use PUT to update.`,
        },
        { status: 400 }
      );
    }

    // Prepare data for Prisma, handling JSON fields
    const prismaData = {
      key,
      footerDestinations: settingsData.footerDestinations ?? Prisma.JsonNull,
      contactPhone: settingsData.contactPhone ?? null,
      contactEmail: settingsData.contactEmail ?? null,
      contactAddress: settingsData.contactAddress ?? null,
      quickLinks: settingsData.quickLinks ?? Prisma.JsonNull,
      socialFacebook: settingsData.socialFacebook ?? null,
      socialYoutube: settingsData.socialYoutube ?? null,
      socialLinkedin: settingsData.socialLinkedin ?? null,
      socialTwitter: settingsData.socialTwitter ?? null,
      socialInstagram: settingsData.socialInstagram ?? null,
      privacyPolicyUrl: settingsData.privacyPolicyUrl ?? null,
      termsOfServiceUrl: settingsData.termsOfServiceUrl ?? null,
      cookiePolicyUrl: settingsData.cookiePolicyUrl ?? null,
      footerDescription: settingsData.footerDescription ?? null,
    } as Prisma.SettingsCreateInput;

    const settings = await prisma.settings.create({
      data: prismaData,
    });

    return Response.json({ data: settings }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating settings:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "Settings with this key already exists" },
        { status: 400 }
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create settings";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Update settings (admin only) - uses upsert pattern
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();

    // Validate the settings data (key is required for PUT)
    if (!body.key) {
      return Response.json({ error: "Key is required" }, { status: 400 });
    }

    // For PUT, we allow partial updates, so validate only provided fields
    const { key, ...updateData } = body;

    // Validate footer settings structure if provided
    if (Object.keys(updateData).length > 0) {
      const validationResult = footerSettingsSchema
        .partial()
        .safeParse(updateData);
      if (!validationResult.success) {
        return Response.json(
          {
            error: "Invalid settings data",
            details: validationResult.error.issues,
          },
          { status: 400 }
        );
      }
      Object.assign(updateData, validationResult.data);
    }

    // Prepare update data for Prisma, handling JSON fields properly
    const prismaUpdateData: Record<string, unknown> = {};

    if (updateData.footerDestinations !== undefined) {
      prismaUpdateData.footerDestinations =
        updateData.footerDestinations ?? Prisma.JsonNull;
    }
    if (updateData.quickLinks !== undefined) {
      prismaUpdateData.quickLinks = updateData.quickLinks ?? Prisma.JsonNull;
    }
    if (updateData.contactPhone !== undefined)
      prismaUpdateData.contactPhone = updateData.contactPhone ?? null;
    if (updateData.contactEmail !== undefined)
      prismaUpdateData.contactEmail = updateData.contactEmail ?? null;
    if (updateData.contactAddress !== undefined)
      prismaUpdateData.contactAddress = updateData.contactAddress ?? null;
    if (updateData.socialFacebook !== undefined)
      prismaUpdateData.socialFacebook = updateData.socialFacebook ?? null;
    if (updateData.socialYoutube !== undefined)
      prismaUpdateData.socialYoutube = updateData.socialYoutube ?? null;
    if (updateData.socialLinkedin !== undefined)
      prismaUpdateData.socialLinkedin = updateData.socialLinkedin ?? null;
    if (updateData.socialTwitter !== undefined)
      prismaUpdateData.socialTwitter = updateData.socialTwitter ?? null;
    if (updateData.socialInstagram !== undefined)
      prismaUpdateData.socialInstagram = updateData.socialInstagram ?? null;
    if (updateData.privacyPolicyUrl !== undefined)
      prismaUpdateData.privacyPolicyUrl = updateData.privacyPolicyUrl ?? null;
    if (updateData.termsOfServiceUrl !== undefined)
      prismaUpdateData.termsOfServiceUrl = updateData.termsOfServiceUrl ?? null;
    if (updateData.cookiePolicyUrl !== undefined)
      prismaUpdateData.cookiePolicyUrl = updateData.cookiePolicyUrl ?? null;
    if (updateData.footerDescription !== undefined)
      prismaUpdateData.footerDescription = updateData.footerDescription ?? null;

    // Use upsert to create or update
    const settings = await prisma.settings.upsert({
      where: { key },
      update: prismaUpdateData as Prisma.SettingsUpdateInput,
      create: {
        key,
        ...prismaUpdateData,
      } as Prisma.SettingsCreateInput,
    });

    return Response.json({ data: settings }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating settings:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update settings";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
