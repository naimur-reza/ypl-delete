"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  duration?: string | null;
  tuitionMin?: number | null;
  tuitionMax?: number | null;
  currency?: string | null;
  university?: {
    name: string;
    logo?: string | null;
  };
  // For intake display
  intakes?: Array<{ intake: string }>;
}

interface UniversityCoursesTableProps {
  courses: Course[];
  universitySlug: string;
  countrySlug?: string;
}

type FilterTab = "all" | "postgraduate" | "research" | "undergraduate";

export function UniversityCoursesTable({
  courses,
  universitySlug,
  countrySlug = "uk",
}: UniversityCoursesTableProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filterTabs: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "research", label: "Research" },
    { value: "undergraduate", label: "Undergraduate" },
  ];

  // Simple title-based filtering (in real scenario, courses would have a level field)
  const filteredCourses = courses.filter((course) => {
    if (activeFilter === "all") return true;
    const title = course.title.toLowerCase();
    if (activeFilter === "postgraduate") {
      return (
        title.includes("msc") ||
        title.includes("mba") ||
        title.includes("master") ||
        title.includes("postgrad")
      );
    }
    if (activeFilter === "research") {
      return (
        title.includes("phd") ||
        title.includes("research") ||
        title.includes("doctorate")
      );
    }
    if (activeFilter === "undergraduate") {
      return (
        title.includes("bsc") ||
        title.includes("ba ") ||
        title.includes("bachelor") ||
        title.includes("undergrad")
      );
    }
    return true;
  });

  // Helper to extract degree type from title
  const getDegreeType = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("msc")) return "MSc";
    if (lowerTitle.includes("mba")) return "MBA";
    if (lowerTitle.includes("ma ")) return "MA";
    if (lowerTitle.includes("phd")) return "PhD";
    if (lowerTitle.includes("bsc")) return "BSc";
    if (lowerTitle.includes("ba ")) return "BA";
    if (lowerTitle.includes("llm")) return "LLM";
    if (lowerTitle.includes("llb")) return "LLB";
    return "Degree";
  };

  // Helper to get intake display
  const getIntakeDisplay = (course: Course): string => {
    if (course.intakes && course.intakes.length > 0) {
      // Map month names
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
      const intakeMonth = monthMap[course.intakes[0].intake] || course.intakes[0].intake;
      return `${intakeMonth} 2026`;
    }
    return "Jan 2026";
  };

  return (
    <section className="py-12 md:py-16 bg-white" id="courses">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Courses offered
          </h2>
          <p className="text-slate-500">
            Explore courses available at this university
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeFilter === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 bg-slate-100 px-6 py-4 rounded-t-lg font-semibold text-slate-700 text-sm">
            <div className="col-span-5">Course Name</div>
            <div className="col-span-2">Intake</div>
            <div className="col-span-3">Degree</div>
            <div className="col-span-2 text-right"></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <div
                  key={course.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center transition-colors hover:bg-slate-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  {/* Course Name */}
                  <div className="md:col-span-5">
                    <Link
                      href={`/${countrySlug}/courses/${course.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      {course.title}
                    </Link>
                    {/* Mobile only info */}
                    <div className="md:hidden mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>Intake: {getIntakeDisplay(course)}</span>
                      <span>Degree: {getDegreeType(course.title)}</span>
                    </div>
                  </div>

                  {/* Intake - Hidden on mobile */}
                  <div className="hidden md:block md:col-span-2 text-slate-600">
                    {getIntakeDisplay(course)}
                  </div>

                  {/* Degree - Hidden on mobile */}
                  <div className="hidden md:block md:col-span-3 text-slate-600">
                    {getDegreeType(course.title)}
                  </div>

                  {/* Action Button */}
                  <div className="md:col-span-2 md:text-right">
                    <Button
                      asChild
                      className="bg-rose-500 hover:bg-rose-600 text-white rounded-md px-4 py-2 text-sm font-medium"
                    >
                      <Link href={`/${countrySlug}/courses/${course.slug}`}>
                        Enquire now
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <p className="text-slate-500">
                  No courses found matching your filter.
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
