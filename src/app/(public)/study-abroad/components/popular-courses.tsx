import {
  ArrowRight,
  BookOpen,
  Code,
  Stethoscope,
  Briefcase,
  Palette,
  Scale,
  Microscope,
  GraduationCap,
  Building2,
  FlaskConical,
  Calculator,
  Music,
  Camera,
  Globe,
  Heart,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Code,
  Microscope,
  Stethoscope,
  Palette,
  Scale,
  BookOpen,
  GraduationCap,
  Building2,
  FlaskConical,
  Calculator,
  Music,
  Camera,
  Globe,
  Heart,
  Lightbulb,
};

interface PopularCoursesProps {
  destinationSlug?: string;
  countrySlug?: string;
}

interface CategoryItem {
  name: string;
  icon: string | null;
  count: number;
  slug: string;
}

function renderSection(displayCategories: CategoryItem[]) {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-blue-600 uppercase">
              Top Disciplines
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Popular Courses
            </h2>
          </div>
          <Link
            href="/courses"
            className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm sm:text-base touch-manipulation min-h-[44px]"
          >
            View All Courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((category, index) => {
            const IconComponent =
              (category.icon && iconMap[category.icon]) || BookOpen;

            return (
              <Link
                key={index}
                href={category.slug ? `/courses/${category.slug}` : "/courses"}
                className="group bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-blue-100 touch-manipulation"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  {category.count > 0 ? `${category.count}+ Courses` : "View Course"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function PopularCourses({
  destinationSlug,
  countrySlug,
}: PopularCoursesProps) {
  // Check if we have any filters
  const hasFilters = destinationSlug || countrySlug;

  // If no filters, fetch 8 courses directly
  if (!hasFilters) {
    const courses = await prisma.course.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });

    // Convert to display format
    const displayCategories = courses.length > 0
      ? courses.map((course) => ({
          name: course.title,
          icon: null,
          count: 1,
          slug: course.slug,
        }))
      : [
          { name: "Business & Management", icon: "Briefcase", count: 0, slug: "" },
          { name: "Computer Science & IT", icon: "Code", count: 0, slug: "" },
          { name: "Engineering", icon: "Microscope", count: 0, slug: "" },
          { name: "Health & Medicine", icon: "Stethoscope", count: 0, slug: "" },
          { name: "Arts & Design", icon: "Palette", count: 0, slug: "" },
          { name: "Law", icon: "Scale", count: 0, slug: "" },
          { name: "Social Sciences", icon: "BookOpen", count: 0, slug: "" },
          { name: "Sciences", icon: "FlaskConical", count: 0, slug: "" },
        ];

    return renderSection(displayCategories);
  }

  // Build where clause for filtering
  const whereClause: Record<string, unknown> = {
    status: "ACTIVE",
  };

  if (destinationSlug) {
    // Match destination by slug (exact match, case-insensitive)
    whereClause.destination = { 
      slug: destinationSlug.toLowerCase()
    };
  }

  if (countrySlug) {
    whereClause.countries = {
      some: { country: { slug: countrySlug } },
    };
  }

  // Fetch courses grouped by categories (using title patterns or first word as category)
  const courses = await prisma.course.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      slug: true,
    },
    take: 100,
  });

  // Group courses by category (extract first meaningful word or use full title)
  const categoryMap = new Map<
    string,
    { name: string; icon: string | null; count: number; slug: string }
  >();

  courses.forEach((course) => {
    // Extract category from title (first 2-3 words or before "in"/"at")
    let category = course.title;
    const separators = [" in ", " at ", " for ", " and "];
    for (const sep of separators) {
      if (category.toLowerCase().includes(sep)) {
        category = category.split(new RegExp(sep, "i"))[0].trim();
        break;
      }
    }
    
    // Limit to first 3 words for category name
    const words = category.split(" ").slice(0, 3);
    category = words.join(" ");

    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category)!;
      existing.count++;
    } else {
      categoryMap.set(category, {
        name: category,
        icon: null,  
        count: 1,
        slug: course.slug,
      });
    }
  });

  // Convert to array and take top 8
  const categories = Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Fallback to static data if no courses found
  const displayCategories =
    categories.length > 0
      ? categories
      : [
          { name: "Business & Management", icon: "Briefcase", count: 0, slug: "" },
          { name: "Computer Science & IT", icon: "Code", count: 0, slug: "" },
          { name: "Engineering", icon: "Microscope", count: 0, slug: "" },
          { name: "Health & Medicine", icon: "Stethoscope", count: 0, slug: "" },
          { name: "Arts & Design", icon: "Palette", count: 0, slug: "" },
          { name: "Law", icon: "Scale", count: 0, slug: "" },
          { name: "Social Sciences", icon: "BookOpen", count: 0, slug: "" },
          { name: "Sciences", icon: "FlaskConical", count: 0, slug: "" },
        ];

  return renderSection(displayCategories);
}
