"use client";

import { useMemo, useTransition, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BlogCard } from "@/components/cards/blog-card";
import { BlogWithCountry } from "@/lib/blogs";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface BlogListClientProps {
  blogs: BlogWithCountry[];
  destinations: Destination[];
  categories: string[];
  countrySlug: string;
  itemsPerPage?: number;
}

// Skeleton component for blog cards
function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-8 w-8 bg-slate-200 rounded-full" />
          <div className="h-4 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function BlogListClient({
  blogs,
  destinations,
  categories,
  countrySlug,
  itemsPerPage = 9,
}: BlogListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDestination = searchParams.get("destination") || "All";
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Loading state for skeleton
  const [isLoading, setIsLoading] = useState(false);
  const [prevParams, setPrevParams] = useState(searchParams.toString());

  // Show skeleton when search params change
  useEffect(() => {
    const currentParams = searchParams.toString();
    if (currentParams !== prevParams) {
      setIsLoading(true);
      setPrevParams(currentParams);
      // Simulate brief loading for visual feedback
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchParams, prevParams]);

  // Client-side filtering
  const filteredBlogs = useMemo(() => {
    let result = blogs;

    // Filter by destination
    if (selectedDestination !== "All") {
      result = result.filter(
        (blog) => blog.destination?.name === selectedDestination,
      );
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchLower) ||
          blog.excerpt?.toLowerCase().includes(searchLower) ||
          blog.content?.toLowerCase().includes(searchLower),
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((blog) => blog.category === selectedCategory);
    }

    return result;
  }, [blogs, selectedDestination, searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(start, start + itemsPerPage);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });

    document
      .getElementById("blog-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="blog-grid" className="scroll-mt-24 space-y-8">
      {/* Blog grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton loaders
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </>
        ) : paginatedBlogs.length ? (
          paginatedBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} countrySlug={countrySlug} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-slate-500 text-lg font-medium">
              No study guides found matching your criteria.
            </p>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("search");
                params.delete("category");
                router.push(`?${params.toString()}`, { scroll: false });
              }}
              className="mt-4 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of{" "}
            {filteredBlogs.length} articles
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-300",
                  currentPage === page
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-primary dark:hover:border-primary/40",
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

