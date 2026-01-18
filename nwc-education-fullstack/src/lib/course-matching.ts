import type { CourseWizardData } from "@/hooks/use-course-wizard";
import {
  mapMonthToIntake,
  matchTestScores,
  calculateRelevanceScore,
} from "./course-matching-helpers";
import type { Prisma } from "../../prisma/src/generated/prisma/client";

type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    destination: true;
    university: {
      select: {
        id: true;
        name: true;
        logo: true;
      };
    };
    intakes: true;
    countries: {
      include: {
        country: true;
      };
    };
  };
}>;

export interface MatchedCourse extends CourseWithRelations {
  relevanceScore: number;
}

/**
 * Build Prisma where clause for course matching
 */
export function buildCourseWhereClause(
  wizardData: CourseWizardData
): Prisma.CourseWhereInput {
  const where: Prisma.CourseWhereInput = {
    status: "ACTIVE",
  };

  // Filter by destination
  if (wizardData.destinationId) {
    where.destinationId = wizardData.destinationId;
  }

  // Filter by intake month
  if (wizardData.startMonth) {
    const targetIntakes = mapMonthToIntake(wizardData.startMonth);
    where.intakes = {
      some: {
        intake: {
          in: targetIntakes,
        },
      },
    };
  }

  // Filter by country (optional - courses available for user's nationality)
  if (wizardData.nationalityId) {
    where.countries = {
      some: {
        countryId: wizardData.nationalityId,
      },
    };
  }

  // Text search for study level and subjects
  const orConditions: Prisma.CourseWhereInput[] = [];

  if (wizardData.studyLevel) {
    // Add study level keywords to search
    const levelKeywords: Record<string, string[]> = {
      Foundation: ["foundation", "preparatory"],
      Undergraduate: ["bachelor", "bsc", "ba", "undergraduate"],
      Postgraduate: ["master", "msc", "ma", "postgraduate", "mba"],
      Doctorate: ["phd", "ph.d", "doctorate", "doctoral"],
    };

    const keywords = levelKeywords[wizardData.studyLevel] || [];
    keywords.forEach((keyword) => {
      orConditions.push({
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      });
    });
  }

  if (wizardData.subjects.length > 0) {
    wizardData.subjects.forEach((subject) => {
      orConditions.push({
        OR: [
          { title: { contains: subject, mode: "insensitive" } },
          { description: { contains: subject, mode: "insensitive" } },
        ],
      });
    });
  }

  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  return where;
}

/**
 * Match courses based on wizard data
 */
export function matchCourses(
  courses: CourseWithRelations[],
  wizardData: CourseWizardData
): MatchedCourse[] {
  // Calculate relevance score for each course
  const matchedCourses: MatchedCourse[] = courses
    .map((course) => {
      const relevanceScore = calculateRelevanceScore(course, wizardData);

      // Additional filtering based on test scores and requirements
      let entryRequirements = "";
      if (
        course.sections &&
        typeof course.sections === "object" &&
        "entryRequirements" in course.sections
      ) {
        entryRequirements =
          (course.sections as { entryRequirements?: string })
            .entryRequirements || "";
      }

      const passesRequirements = matchTestScores(
        entryRequirements,
        wizardData.ieltsScores,
        wizardData.satScores,
        wizardData.highSchoolData?.score,
        wizardData.highSchoolData?.englishPercentage
      );

      // Filter out courses that don't meet requirements
      if (!passesRequirements && relevanceScore < 5) {
        return null;
      }

      return {
        ...course,
        relevanceScore,
      };
    })
    .filter((course): course is MatchedCourse => course !== null);

  // Sort by relevance score (descending)
  return matchedCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
