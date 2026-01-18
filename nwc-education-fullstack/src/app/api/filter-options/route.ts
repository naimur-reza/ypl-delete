import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    switch (type) {
      case "destinations": {
        const destinations = await prisma.destination.findMany({
          select: { id: true, name: true, slug: true },
          orderBy: { name: "asc" },
        });
        return Response.json(destinations);
      }

      case "countries": {
        const countries = await prisma.country.findMany({
          select: { id: true, name: true, slug: true, flag: true },
          orderBy: { name: "asc" },
        });
        return Response.json(countries);
      }

      case "studyLevels": {
        // Get unique study levels from courses (you might want to add a StudyLevel enum in schema)
        const studyLevels = [
          { id: "bachelor", name: "Bachelor" },
          { id: "master", name: "Master" },
          { id: "phd", name: "PhD" },
          { id: "diploma", name: "Diploma" },
          { id: "certificate", name: "Certificate" },
        ];
        return Response.json(studyLevels);
      }

      case "cities": {
        // Get unique cities from events
        const events = await prisma.event.findMany({
          where: { location: { not: null } },
          select: { location: true },
          distinct: ["location"],
        });
        const cities = events
          .map((e) => e.location)
          .filter((loc): loc is string => !!loc)
          .map((loc, idx) => ({ id: `city-${idx}`, name: loc }));
        return Response.json(cities);
      }

      case "months": {
        const months = [
          { id: "1", name: "January" },
          { id: "2", name: "February" },
          { id: "3", name: "March" },
          { id: "4", name: "April" },
          { id: "5", name: "May" },
          { id: "6", name: "June" },
          { id: "7", name: "July" },
          { id: "8", name: "August" },
          { id: "9", name: "September" },
          { id: "10", name: "October" },
          { id: "11", name: "November" },
          { id: "12", name: "December" },
        ];
        return Response.json(months);
      }

      case "eventTypes": {
        const eventTypes = [
          { id: "EXPO", name: "Expo" },
          { id: "WEBINAR", name: "Webinar" },
          { id: "ADMISSION_DAY", name: "Admission Day" },
          { id: "OPEN_DAY", name: "Open Day" },
          { id: "SEMINAR", name: "Seminar" },
          { id: "WORKSHOP", name: "Workshop" },
        ];
        return Response.json(eventTypes);
      }

      default:
        return Response.json(
          { error: "Invalid filter type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return Response.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
