import { Course } from "@/generated/prisma/client";
import { CourseCard } from "./course-card";
import { CourseFilterSidebar } from "./course-filter-sidebar";

interface CourseListingProps {
  courses: Array<Course & {
    university?: {
      name: string;
      logo?: string | null;
    };
  }>;
}

export function CourseListing({ courses }: CourseListingProps) {
  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseFilterSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Showing {courses.length} Courses
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            {/* Pagination Mockup */}
            <div className="mt-12 flex justify-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">Previous</button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white">1</button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">2</button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">3</button>
              <span className="px-2 py-2 text-slate-400">...</span>
              <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
