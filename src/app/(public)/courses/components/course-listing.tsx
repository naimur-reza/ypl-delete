"use client";

import { useMemo } from "react";

import { CourseCard } from "./course-card";
import { ReusableFilter } from "@/components/filters/reusable-filter";
import { extractCourseFilterOptions } from "@/lib/course-filters";
import { useFilter } from "@/hooks/use-filter";
import { Course } from "../../../../../prisma/src/generated/prisma/client";

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
    }
  >;
}

export function CourseListing({ courses }: CourseListingProps) {
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
    },
    searchFields: [(course) => course.title, (course) => course.description],
  });

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ReusableFilter
              filters={filterOptions}
              selectedFilters={filters}
              onFilterChange={toggleFilter}
              onClearAll={clearFilters}
              searchPlaceholder="Search courses..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              defaultOpenSections={["destination", "university"]}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Showing {filteredData.length}{" "}
                {filteredData.length === 1 ? "Course" : "Courses"}
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

            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4">
                {filteredData.map((course) => (
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

            {/* Pagination Mockup */}
            {filteredData.length > 0 && (
              <div className="mt-12 flex justify-center gap-2">
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary text-white">
                  1
                </button>
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  2
                </button>
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  3
                </button>
                <span className="px-2 py-2 text-slate-400">...</span>
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
