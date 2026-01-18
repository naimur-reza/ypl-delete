import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.studyCountry, {
    searchFields: ["name", "slug"],
    defaultSort: { createdAt: "desc" },
  });
}
