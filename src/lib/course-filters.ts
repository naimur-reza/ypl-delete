import { FilterOption } from "@/components/filters/reusable-filter";
import {
  StudyLevel,
  Faculty,
  IntakeMonth,
} from "../../prisma/src/generated/prisma/client";

interface Course {
  id: string;
  title: string;
  duration?: string | null;
  studyLevel?: StudyLevel | null;
  faculty?: Faculty | null;
  destination?: {
    id: string;
    name: string;
  } | null;
  university?: {
    id: string;
    name: string;
  } | null;
  intakes?: Array<{
    intake: IntakeMonth;
  }>;
}

// Human-readable labels for enums
const STUDY_LEVEL_LABELS: Record<StudyLevel, string> = {
  FOUNDATION: "Foundation",
  BACHELOR: "Bachelor's Degree",
  MASTER: "Master's Degree",
  PHD: "PhD / Doctorate",
  DIPLOMA: "Diploma",
  CERTIFICATE: "Certificate",
  PATHWAY: "Pathway Program",
};

const FACULTY_LABELS: Record<Faculty, string> = {
  ENGINEERING: "Engineering",
  BUSINESS: "Business & Management",
  ARTS_HUMANITIES: "Arts & Humanities",
  SCIENCE: "Science",
  MEDICINE_HEALTH: "Medicine & Health",
  LAW: "Law",
  EDUCATION: "Education",
  SOCIAL_SCIENCES: "Social Sciences",
  IT_COMPUTING: "IT & Computing",
  ARCHITECTURE: "Architecture & Design",
  AGRICULTURE: "Agriculture",
  HOSPITALITY_TOURISM: "Hospitality & Tourism",
  MEDIA_COMMUNICATION: "Media & Communication",
  OTHER: "Other",
};

const INTAKE_LABELS: Record<IntakeMonth, string> = {
  JANUARY: "January Intake",
  MAY: "May Intake",
  SEPTEMBER: "September Intake",
};

// Parse duration string to category
function parseDurationCategory(
  duration: string | null | undefined
): string | null {
  if (!duration) return null;

  const lower = duration.toLowerCase();

  // Extract number of years/months
  const yearMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:year|yr)/);
  const monthMatch = lower.match(/(\d+)\s*(?:month|mo)/);

  let months = 0;
  if (yearMatch) {
    months = parseFloat(yearMatch[1]) * 12;
  }
  if (monthMatch) {
    months += parseInt(monthMatch[1]);
  }

  // If no match, try to extract just a number (assume years)
  if (months === 0) {
    const numMatch = lower.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) {
      months = parseFloat(numMatch[1]) * 12;
    }
  }

  if (months === 0) return null;

  // Categorize
  if (months <= 6) return "0-6 months";
  if (months <= 12) return "6-12 months";
  if (months <= 24) return "1-2 years";
  if (months <= 36) return "2-3 years";
  return "3+ years";
}

export function extractCourseFilterOptions(courses: Course[]): FilterOption[] {
  // Extract unique destinations with counts
  const destinationMap = new Map<string, { name: string; count: number }>();
  courses.forEach((course) => {
    if (course.destination) {
      const key = course.destination.id;
      const existing = destinationMap.get(key);
      destinationMap.set(key, {
        name: course.destination.name,
        count: (existing?.count || 0) + 1,
      });
    }
  });

  const destinationOptions = Array.from(destinationMap.entries())
    .map(([value, data]) => ({
      label: data.name,
      value,
      count: data.count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Extract unique universities with counts
  const universityMap = new Map<string, { name: string; count: number }>();
  courses.forEach((course) => {
    if (course.university) {
      const key = course.university.id;
      const existing = universityMap.get(key);
      universityMap.set(key, {
        name: course.university.name,
        count: (existing?.count || 0) + 1,
      });
    }
  });

  const universityOptions = Array.from(universityMap.entries())
    .map(([value, data]) => ({
      label: data.name,
      value,
      count: data.count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, 50);

  // Extract study levels with counts
  const studyLevelMap = new Map<string, number>();
  courses.forEach((course) => {
    if (course.studyLevel) {
      const count = studyLevelMap.get(course.studyLevel) || 0;
      studyLevelMap.set(course.studyLevel, count + 1);
    }
  });

  const studyLevelOrder: StudyLevel[] = [
    "FOUNDATION",
    "BACHELOR",
    "MASTER",
    "PHD",
    "DIPLOMA",
    "CERTIFICATE",
    "PATHWAY",
  ];

  const studyLevelOptions = studyLevelOrder
    .filter((level) => studyLevelMap.has(level))
    .map((level) => ({
      label: STUDY_LEVEL_LABELS[level],
      value: level,
      count: studyLevelMap.get(level) || 0,
    }));

  // Extract faculties with counts
  const facultyMap = new Map<string, number>();
  courses.forEach((course) => {
    if (course.faculty) {
      const count = facultyMap.get(course.faculty) || 0;
      facultyMap.set(course.faculty, count + 1);
    }
  });

  const facultyOptions = Array.from(facultyMap.entries())
    .map(([value, count]) => ({
      label: FACULTY_LABELS[value as Faculty],
      value,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Extract duration categories with counts
  const durationMap = new Map<string, number>();
  courses.forEach((course) => {
    const category = parseDurationCategory(course.duration);
    if (category) {
      const count = durationMap.get(category) || 0;
      durationMap.set(category, count + 1);
    }
  });

  const durationOrder = [
    "0-6 months",
    "6-12 months",
    "1-2 years",
    "2-3 years",
    "3+ years",
  ];
  const durationOptions = durationOrder
    .filter((d) => durationMap.has(d))
    .map((d) => ({
      label: d,
      value: d,
      count: durationMap.get(d) || 0,
    }));

  // Extract intake months with counts
  const intakeMap = new Map<string, number>();
  courses.forEach((course) => {
    course.intakes?.forEach((intake) => {
      const count = intakeMap.get(intake.intake) || 0;
      intakeMap.set(intake.intake, count + 1);
    });
  });

  const intakeOrder: IntakeMonth[] = ["JANUARY", "MAY", "SEPTEMBER"];
  const intakeOptions = intakeOrder
    .filter((intake) => intakeMap.has(intake))
    .map((intake) => ({
      label: INTAKE_LABELS[intake],
      value: intake,
      count: intakeMap.get(intake) || 0,
    }));

  // Build filter options array - only include sections with options
  const filters: FilterOption[] = [];

  if (destinationOptions.length > 0) {
    filters.push({
      id: "destination",
      label: "Study Destination",
      options: destinationOptions,
    });
  }

  if (studyLevelOptions.length > 0) {
    filters.push({
      id: "studyLevel",
      label: "Study Level",
      options: studyLevelOptions,
    });
  }

  if (facultyOptions.length > 0) {
    filters.push({
      id: "faculty",
      label: "Faculty / Subject Area",
      options: facultyOptions,
    });
  }

  if (durationOptions.length > 0) {
    filters.push({
      id: "duration",
      label: "Duration",
      options: durationOptions,
    });
  }

  if (intakeOptions.length > 0) {
    filters.push({
      id: "intake",
      label: "Intake",
      options: intakeOptions,
    });
  }

  if (universityOptions.length > 0) {
    filters.push({
      id: "university",
      label: "University",
      options: universityOptions,
    });
  }

  return filters;
}

// Export labels for use in other components
export {
  STUDY_LEVEL_LABELS,
  FACULTY_LABELS,
  INTAKE_LABELS,
  parseDurationCategory,
};
