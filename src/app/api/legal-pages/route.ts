import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  canManageContent,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/auth-helpers";
import { LegalPageType } from "../../../../prisma/src/generated/prisma/enums";
 

const TYPE_MAP: Record<string, LegalPageType> = {
  "privacy-policy": "PRIVACY_POLICY",
  "terms-and-conditions": "TERMS_AND_CONDITIONS",
  PRIVACY_POLICY: "PRIVACY_POLICY",
  TERMS_AND_CONDITIONS: "TERMS_AND_CONDITIONS",
};

function parseType(s: string | null): LegalPageType | null {
  if (!s) return null;
  return TYPE_MAP[s] ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const typeParam = url.searchParams.get("type");
    const type = parseType(typeParam);

    if (type) {
      const page = await prisma.legalPage.findUnique({
        where: { type },
      });
      return Response.json({ data: page });
    }

    const [privacyPolicy, termsAndConditions] = await Promise.all([
      prisma.legalPage.findUnique({ where: { type: "PRIVACY_POLICY" } }),
      prisma.legalPage.findUnique({ where: { type: "TERMS_AND_CONDITIONS" } }),
    ]);

    return Response.json({
      data: {
        PRIVACY_POLICY: privacyPolicy,
        TERMS_AND_CONDITIONS: termsAndConditions,
      },
      privacyPolicy,
      termsAndConditions,
    });
  } catch (error) {
    console.error("Error fetching legal pages:", error);
    return Response.json(
      { error: "Failed to fetch legal pages" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  try {
    const body = await req.json();
    const { type: typeArg, title, subtitle, content } = body;

    const type = parseType(typeArg ?? body.type);
    if (!type) {
      return Response.json(
        { error: "Invalid or missing type. Use PRIVACY_POLICY or TERMS_AND_CONDITIONS." },
        { status: 400 }
      );
    }

    const page = await prisma.legalPage.upsert({
      where: { type },
      create: {
        type,
        title: title ?? (type === "PRIVACY_POLICY" ? "Privacy Policy" : "Terms and Conditions"),
        subtitle: subtitle ?? null,
        content: content ?? null,
      },
      update: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(content !== undefined && { content }),
      },
    });

    return Response.json({ data: page });
  } catch (error) {
    console.error("Error upserting legal page:", error);
    return Response.json(
      { error: "Failed to save legal page" },
      { status: 500 }
    );
  }
}
