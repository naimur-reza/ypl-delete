"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CountryAwareLink } from "../common/navbar/country-aware-link";

// StudyLevel enum values from Prisma schema
type StudyLevel =
  | "FOUNDATION"
  | "BACHELOR"
  | "MASTER"
  | "PHD"
  | "DIPLOMA"
  | "CERTIFICATE"
  | "PATHWAY";

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  duration?: string | null;
  tuitionMin?: number | null;
  tuitionMax?: number | null;
  currency?: string | null;
  studyLevel?: StudyLevel | null;
  university?: {
    name: string;
    logo?: string | null;
  };
  intakes?: Array<{ intake: string }>;
}

interface UniversityCoursesProps {
  courses: Course[];
  universitySlug: string;
  countrySlug?: string;
}

type FilterTab = "all" | StudyLevel;

// Human-readable labels for study levels
const STUDY_LEVEL_LABELS: Record<StudyLevel, string> = {
  FOUNDATION: "Foundation",
  BACHELOR: "Bachelor's Degree",
  MASTER: "Master's Degree",
  PHD: "PhD / Doctorate",
  DIPLOMA: "Diploma",
  CERTIFICATE: "Certificate",
  PATHWAY: "Pathway Program",
};

export function UniversityCourses({
  courses,
  universitySlug,
  countrySlug = "uk",
}: UniversityCoursesProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  // Get unique study levels from courses for dynamic tabs
  const availableStudyLevels = Array.from(
    new Set(
      courses
        .map((c) => c.studyLevel)
        .filter(
          (level): level is StudyLevel => level !== null && level !== undefined,
        ),
    ),
  );

  // Build filter tabs dynamically based on available study levels
  const filterTabs: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    ...availableStudyLevels.map((level) => ({
      value: level,
      label: STUDY_LEVEL_LABELS[level] || level,
    })),
  ];

  // Filter by search and study level
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Study level filter
    if (activeFilter === "all") return true;
    return course.studyLevel === activeFilter;
  });

  // Helper to get study level display
  const getStudyLevelDisplay = (
    level: StudyLevel | null | undefined,
  ): string => {
    if (!level) return "—";
    return STUDY_LEVEL_LABELS[level] || level;
  };

  // Helper to get intake display
  const getIntakeDisplay = (course: Course): string => {
    if (course.intakes && course.intakes.length > 0) {
      const monthMap: Record<string, string> = {
        JANUARY: "Jan",
        FEBRUARY: "Feb",
        MARCH: "Mar",
        APRIL: "Apr",
        MAY: "May",
        JUNE: "Jun",
        JULY: "Jul",
        AUGUST: "Aug",
        SEPTEMBER: "Sep",
        OCTOBER: "Oct",
        NOVEMBER: "Nov",
        DECEMBER: "Dec",
      };
      const intakeMonth =
        monthMap[course.intakes[0].intake] || course.intakes[0].intake;
      return `${intakeMonth} 2026`;
    }
    return "—";
  };

  return (
    <section className="py-12 md:py-16 bg-white" id="courses">
      <div className="container mx-auto px-4">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Courses offered
            </h2>
            <p className="text-slate-500">
              Explore courses available at this university
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search courses..."
              className="pl-10 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 bg-slate-50 px-6 py-4 font-semibold text-slate-700 text-sm border-b border-slate-200">
            <div className="col-span-5">Course Name</div>
            <div className="col-span-2">Intake</div>
            <div className="col-span-3">Study Level</div>
            <div className="col-span-2 text-right"></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <div
                  key={course.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center transition-colors hover:bg-slate-50 ${
                    index % 2 === 1 ? "bg-slate-50/30" : "bg-white"
                  }`}
                >
                  {/* Course Name */}
                  <div className="md:col-span-5">
                    <CountryAwareLink
                      href={`/university/${universitySlug}/courses/${course.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      {course.title}
                    </CountryAwareLink>
                    {/* Mobile only info */}
                    <div className="md:hidden mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>Intake: {getIntakeDisplay(course)}</span>
                      <span>
                        Level: {getStudyLevelDisplay(course.studyLevel)}
                      </span>
                    </div>
                  </div>

                  {/* Intake */}
                  <div className="hidden md:block md:col-span-2 text-slate-600">
                    {getIntakeDisplay(course)}
                  </div>

                  {/* Study Level */}
                  <div className="hidden md:block md:col-span-3">
                    {course.studyLevel && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {getStudyLevelDisplay(course.studyLevel)}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="md:col-span-2 md:text-right">
                    <Button
                      asChild
                      className="bg-rose-500 hover:bg-rose-600 text-white rounded-md px-4 py-2 text-sm font-medium"
                    >
                      <CountryAwareLink
                        href={`/university/${universitySlug}/courses/${course.slug}`}
                      >
                        Enquire now
                      </CountryAwareLink>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50">
                <p className="text-slate-500">
                  No courses found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* View All Button */}
        {courses.length > 6 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-full px-8">
              View All Courses
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
