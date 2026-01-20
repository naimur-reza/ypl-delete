"use client";

import { useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BlogCard } from "@/components/cards/blog-card";
import { BlogCardSkeleton } from "@/components/blog-card-skeleton";
import { BlogFilter } from "./blog-filter";
import { BlogWithCountry } from "@/lib/blogs";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface BlogListClientOptimizedProps {
  blogs: BlogWithCountry[];
  destinations: Destination[];
  categories: string[];
  countrySlug: string;
  itemsPerPage?: number;
}

export function BlogListClientOptimized({
  blogs,
  destinations,
  categories,
  countrySlug,
  itemsPerPage = 9,
}: BlogListClientOptimizedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // State for client-side filtering
  const [filters, setFilters] = useState({
    destination: searchParams.get("destination") || "All",
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "All",
    page: Number(searchParams.get("page")) || 1,
  });

  // Client-side filtering with memoization for performance
  const filteredBlogs = useMemo(() => {
    let result = blogs;

    // Filter by destination
    if (filters.destination !== "All") {
      result = result.filter(
        (blog) => blog.destination?.name === filters.destination,
      );
    }

    // Filter by search query
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchLower) ||
          blog.excerpt?.toLowerCase().includes(searchLower) ||
          blog.content?.toLowerCase().includes(searchLower),
      );
    }

    // Filter by category
    if (filters.category !== "All") {
      result = result.filter((blog) => blog.category === filters.category);
    }

    return result;
  }, [blogs, filters.destination, filters.search, filters.category]);

  // Pagination with memoization
  const totalPages = useMemo(
    () => Math.ceil(filteredBlogs.length / itemsPerPage),
    [filteredBlogs.length, itemsPerPage],
  );

  const paginatedBlogs = useMemo(() => {
    const start = (filters.page - 1) * itemsPerPage;
    return filteredBlogs.slice(start, start + itemsPerPage);
  }, [filteredBlogs, filters.page, itemsPerPage]);

  // Optimized filter change handler
  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      setIsLoading(true);
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change

      // Update URL for bookmarking/sharing
      const params = new URLSearchParams();
      if (newFilters.destination && newFilters.destination !== "All") {
        params.set("destination", newFilters.destination);
      }
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }
      if (newFilters.category && newFilters.category !== "All") {
        params.set("category", newFilters.category);
      }
      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });

      // Simulate loading state for better UX
      setTimeout(() => setIsLoading(false), 150);
    },
    [router],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setIsLoading(true);
      setFilters((prev) => ({ ...prev, page }));

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`, { scroll: false });

      setTimeout(() => {
        setIsLoading(false);
        document
          .getElementById("blog-grid")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    },
    [router, searchParams],
  );

  return (
    <div id="blog-grid" className="scroll-mt-24">
      <BlogFilter
        countries={destinations}
        categories={categories}
        initialCountry={countrySlug === "global" ? null : countrySlug}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          // Show skeleton cards while loading
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <BlogCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : paginatedBlogs.length ? (
          paginatedBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} countrySlug={countrySlug} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 text-lg">
              No study guides found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500">
            Showing {(filters.page - 1) * itemsPerPage + 1} to{" "}
            {Math.min(filters.page * itemsPerPage, filteredBlogs.length)} of{" "}
            {filteredBlogs.length} articles
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                  filters.page === page
                    ? "bg-primary text-white"
                    : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
