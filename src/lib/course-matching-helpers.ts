import type {
  StudyLevel,
  MonthRange,
  IntakeMonth,
} from "@/hooks/use-course-wizard";

/**
 * Infer study level from course title
 */
export function inferStudyLevel(courseTitle: string): StudyLevel | null {
  const title = courseTitle.toLowerCase();

  if (
    title.includes("foundation") ||
    title.includes("foundation year") ||
    title.includes("preparatory")
  ) {
    return "Foundation";
  }

  if (
    title.includes("bachelor") ||
    title.includes("bsc") ||
    title.includes("ba") ||
    title.includes("b.eng") ||
    title.includes("undergraduate") ||
    title.includes("bachelor's")
  ) {
    return "Undergraduate";
  }

  if (
    title.includes("master") ||
    title.includes("msc") ||
    title.includes("ma") ||
    title.includes("m.eng") ||
    title.includes("postgraduate") ||
    title.includes("master's") ||
    title.includes("mba")
  ) {
    return "Postgraduate";
  }

  if (
    title.includes("phd") ||
    title.includes("ph.d") ||
    title.includes("doctorate") ||
    title.includes("doctoral") ||
    title.includes("d.phil")
  ) {
    return "Doctorate";
  }

  return null;
}

/**
 * Check if course title/description contains subject keywords
 */
export function matchSubjects(
  courseTitle: string,
  courseDescription: string | null | undefined,
  subjects: string[]
): boolean {
  if (subjects.length === 0) return true;

  const searchText = `${courseTitle} ${courseDescription || ""}`.toLowerCase();

  return subjects.some((subject) => {
    const subjectLower = subject.toLowerCase();
    // Check for exact word match or partial match
    return (
      searchText.includes(subjectLower) ||
      subjectLower.split(" ").some((word) => searchText.includes(word))
    );
  });
}

/**
 * Search entryRequirements for test scores and academic qualifications
 */
export function matchTestScores(
  entryRequirements: string | null | undefined,
  ieltsScores?: { overall: number },
  satScores?: { total: number },
  highSchoolScore?: number,
  englishPercentage?: number
): boolean {
  if (!entryRequirements) return true; // If no requirements, assume match

  const requirements = entryRequirements.toLowerCase();

  // Check IELTS scores
  if (ieltsScores && ieltsScores.overall > 0) {
    const ieltsMatch = requirements.match(/ielts.*?(\d+\.?\d*)/);
    if (ieltsMatch) {
      const requiredScore = parseFloat(ieltsMatch[1]);
      if (ieltsScores.overall < requiredScore) {
        return false;
      }
    }
  }

  // Check SAT scores
  if (satScores && satScores.total > 0) {
    const satMatch = requirements.match(/sat.*?(\d+)/);
    if (satMatch) {
      const requiredScore = parseInt(satMatch[1]);
      if (satScores.total < requiredScore) {
        return false;
      }
    }
  }

  // Check English percentage
  if (englishPercentage !== undefined && englishPercentage > 0) {
    const englishMatch = requirements.match(/english.*?(\d+)%/);
    if (englishMatch) {
      const requiredPercentage = parseInt(englishMatch[1]);
      if (englishPercentage < requiredPercentage) {
        return false;
      }
    }
  }

  // Check high school scores (basic check)
  if (highSchoolScore !== undefined && highSchoolScore > 0) {
    // Look for GPA/CGPA requirements
    const gpaMatch = requirements.match(/(?:gpa|cgpa).*?(\d+\.?\d*)/);
    if (gpaMatch) {
      const requiredGpa = parseFloat(gpaMatch[1]);
      // Basic comparison - might need adjustment based on grading system
      if (highSchoolScore < requiredGpa) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Map user month selection to IntakeMonth enum
 */
export function mapMonthToIntake(monthRange: MonthRange): IntakeMonth[] {
  switch (monthRange) {
    case "January - March":
      return ["JANUARY"];
    case "April - June":
      return ["MAY"];
    case "July - September":
      return ["SEPTEMBER"];
    case "October - December":
      return ["JANUARY"]; // Next year's January intake
    default:
      return [];
  }
}

/**
 * Calculate relevance score for a course match
 */
export function calculateRelevanceScore(
  course: {
    destinationId: string;
    intakes: Array<{ intake: IntakeMonth }>;
    countries?: Array<{ countryId: string }>;
    title: string;
    description?: string | null;
    sections?: unknown;
  },
  userInputs: {
    destinationId?: string;
    startMonth?: MonthRange;
    studyLevel?: StudyLevel;
    subjects: string[];
    nationalityId?: string;
    ieltsScores?: { overall: number };
    satScores?: { total: number };
    highSchoolData?: {
      score: number;
      englishPercentage: number;
    };
  }
): number {
  let score = 0;

  // Exact destination match: +10 points
  if (course.destinationId === userInputs.destinationId) {
    score += 10;
  }

  // Intake match: +10 points
  if (userInputs.startMonth) {
    const targetIntakes = mapMonthToIntake(userInputs.startMonth);
    const hasMatchingIntake = course.intakes.some((intake) =>
      targetIntakes.includes(intake.intake)
    );
    if (hasMatchingIntake) {
      score += 10;
    }
  }

  // Study level match: +5 points
  if (userInputs.studyLevel) {
    const inferredLevel = inferStudyLevel(course.title);
    if (inferredLevel === userInputs.studyLevel) {
      score += 5;
    }
  }

  // Subject match: +3 points per subject
  if (userInputs.subjects.length > 0) {
    const subjectMatches = userInputs.subjects.filter((subject) =>
      matchSubjects(course.title, course.description || undefined, [subject])
    );
    score += subjectMatches.length * 3;
  }

  // Country match: +2 points (optional)
  if (
    userInputs.nationalityId &&
    course.countries?.some((c) => c.countryId === userInputs.nationalityId)
  ) {
    score += 2;
  }

  // Test score compatibility: +2 points
  let entryRequirements = "";
  if (
    course.sections &&
    typeof course.sections === "object" &&
    "entryRequirements" in course.sections
  ) {
    entryRequirements =
      (course.sections as { entryRequirements?: string }).entryRequirements ||
      "";
  }
  if (
    matchTestScores(
      entryRequirements,
      userInputs.ieltsScores,
      userInputs.satScores,
      userInputs.highSchoolData?.score,
      userInputs.highSchoolData?.englishPercentage
    )
  ) {
    score += 2;
  }

  return score;
}
