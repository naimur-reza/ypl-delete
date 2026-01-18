import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildCourseWhereClause, matchCourses } from "@/lib/course-matching";
import type { CourseWizardData } from "@/hooks/use-course-wizard";

export async function POST(req: NextRequest) {
  try {
    const wizardData: CourseWizardData = await req.json();

    // Build where clause based on wizard data
    const where = buildCourseWhereClause(wizardData);

    // Fetch courses with relations
    const courses = await prisma.course.findMany({
      where,
      include: {
        destination: true,
        university: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        intakes: true,
        countries: {
          include: {
            country: {
              select: {
                id: true,
                name: true,
                isoCode: true,
              },
            },
          },
        },
      },
      take: 100, // Limit initial results
    });

    // Match and score courses
    const matchedCourses = matchCourses(courses, wizardData);

    // Return top 20 matches
    return NextResponse.json({
      success: true,
      courses: matchedCourses.slice(0, 20),
      total: matchedCourses.length,
    });
  } catch (error) {
    console.error("Error matching courses:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to match courses",
      },
      { status: 500 }
    );
  }
}
