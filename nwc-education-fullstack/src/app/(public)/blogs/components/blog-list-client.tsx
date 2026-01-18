"use client";

import { useMemo } from "react";
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
  countrySlug: string;
  itemsPerPage?: number;
}

export function BlogListClient({
  blogs,
  destinations,
  countrySlug,
  itemsPerPage = 9,
}: BlogListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDestination = searchParams.get("destination") || "All";
  const searchQuery = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Client-side filtering
  const filteredBlogs = useMemo(() => {
    let result = blogs;

    // Filter by destination
    if (selectedDestination !== "All") {
      result = result.filter(
        (blog) => blog.destination?.name === selectedDestination
      );
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchLower) ||
          blog.excerpt?.toLowerCase().includes(searchLower) ||
          blog.content?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [blogs, selectedDestination, searchQuery]);

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
    <div id="blog-grid" className="scroll-mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedBlogs.length ? (
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
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of{" "}
            {filteredBlogs.length} articles
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
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
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
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
