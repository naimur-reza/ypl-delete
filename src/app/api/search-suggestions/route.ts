import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type SuggestionType =
  | "universities"
  | "courses"
  | "scholarships"
  | "events";

export interface Suggestion {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  type: SuggestionType;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const type = (searchParams.get("type") || "universities") as SuggestionType;
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    let suggestions: Suggestion[] = [];

    switch (type) {
      case "universities":
        const universities = await prisma.university.findMany({
          where: {
            status: "ACTIVE",
            name: { contains: query, mode: "insensitive" },
          },
          select: {
            id: true,
            name: true,
            logo: true,
            destination: { select: { name: true } },
          },
          take: limit,
          orderBy: { name: "asc" },
        });
        suggestions = universities.map((u) => ({
          id: u.id,
          name: u.name,
          subtitle: u.destination?.name || undefined,
          image: u.logo || undefined,
          type: "universities" as const,
        }));
        break;

      case "courses":
        const courses = await prisma.course.findMany({
          where: {
            status: "ACTIVE",
            title: { contains: query, mode: "insensitive" },
          },
          select: {
            id: true,
            title: true,
            duration: true,
            university: { select: { name: true, logo: true } },
          },
          take: limit,
          orderBy: { title: "asc" },
        });
        suggestions = courses.map((c) => ({
          id: c.id,
          name: c.title,
          subtitle: c.university?.name
            ? `${c.university.name}${c.duration ? ` • ${c.duration}` : ""}`
            : c.duration || undefined,
          image: c.university?.logo || undefined,
          type: "courses" as const,
        }));
        break;

      case "scholarships":
        const scholarships = await prisma.scholarship.findMany({
          where: {
            status: "ACTIVE",
            title: { contains: query, mode: "insensitive" },
          },
          select: {
            id: true,
            title: true,
            image: true,
            destination: { select: { name: true } },
            university: { select: { name: true } },
          },
          take: limit,
          orderBy: { title: "asc" },
        });
        suggestions = scholarships.map((s) => ({
          id: s.id,
          name: s.title,
          subtitle: s.university?.name || s.destination?.name || undefined,
          image: s.image || undefined,
          type: "scholarships" as const,
        }));
        break;

      case "events":
        const events = await prisma.event.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { location: { contains: query, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            title: true,
            location: true,
            thumbnail: true,
            startDate: true,
          },
          take: limit,
          orderBy: { startDate: "desc" },
        });
        suggestions = events.map((e) => ({
          id: e.id,
          name: e.title,
          subtitle:
            `${e.location || ""} ${
              e.startDate
                ? `• ${new Date(e.startDate).toLocaleDateString()}`
                : ""
            }`.trim() || undefined,
          image: e.thumbnail || undefined,
          type: "events" as const,
        }));
        break;
    }

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
