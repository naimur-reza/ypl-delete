"use client";

import { useMemo, useState } from "react";

import { CourseCard } from "./course-card";
import { ReusableFilter } from "@/components/filters/reusable-filter";
import { Pagination } from "@/components/ui/pagination";
import {
  extractCourseFilterOptions,
  parseDurationCategory,
} from "@/lib/course-filters";
import { useFilter } from "@/hooks/use-filter";
import {
  Course,
  IntakeMonth,
} from "../../../../../../prisma/src/generated/prisma/client";

const COURSES_PER_PAGE = 10;

interface CourseListingProps {
  courses: Array<
    Course & {
      university?: {
        id: string;
        name: string;
        logo?: string | null;
      };
      destination?: {
        id: string;
        name: string;
      };
      intakes?: Array<{
        intake: IntakeMonth;
      }>;
    }
  >;
}

export function CourseListing({ courses }: CourseListingProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = useMemo(
    () => extractCourseFilterOptions(courses),
    [courses]
  );

  const {
    filters,
    searchQuery,
    filteredData,
    toggleFilter,
    clearFilters,
    setSearchQuery,
  } = useFilter({
    data: courses,
    filterConfig: {
      destination: {
        getValue: (course) => course.destination?.id,
        matchType: "exact",
      },
      university: {
        getValue: (course) => course.university?.id,
        matchType: "exact",
      },
      studyLevel: {
        getValue: (course) => course.studyLevel,
        matchType: "exact",
      },
      faculty: {
        getValue: (course) => course.faculty,
        matchType: "exact",
      },
      duration: {
        getValue: (course) => parseDurationCategory(course.duration),
        matchType: "exact",
      },
      intake: {
        getValue: (course) => course.intakes?.map((i) => i.intake),
        matchType: "array",
      },
    },
    searchFields: [(course) => course.title, (course) => course.description],
  });

  // Reset to page 1 when filters change
  const handleFilterChange = (filterKey: string, value: string) => {
    setCurrentPage(1);
    toggleFilter(filterKey, value);
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    clearFilters();
  };

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setSearchQuery(value);
  };

  // Pagination calculations
  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const paginatedCourses = filteredData.slice(startIndex, endIndex);

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ReusableFilter
              filters={filterOptions}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearFilters}
              searchPlaceholder="Search courses..."
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
              defaultOpenSections={["destination", "studyLevel", "faculty"]}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Showing {paginatedCourses.length} of {totalCount}{" "}
                {totalCount === 1 ? "Course" : "Courses"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Popularity</option>
                  <option>Tuition (Low to High)</option>
                  <option>Tuition (High to Low)</option>
                  <option>Name (A-Z)</option>
                </select>
              </div>
            </div>

            {paginatedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4">
                {paginatedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-lg">No courses found.</p>
                <p className="text-slate-400 text-sm mt-2">
                  {Object.keys(filters).length > 0 || searchQuery
                    ? "Try adjusting your filters or search query."
                    : "Check back later for new courses."}
                </p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              itemName="courses"
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
