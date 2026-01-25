import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: {
    title: string;
    excerpt: string | null;
    slug: string;
    image: string | null;
    publishedAt: Date | null;
    category?: string | null;
    readTime?: string; // Optional if not in DB
    isFeatured?: boolean;
  };
  countrySlug?: string | null;
  className?: string;
  featured?: boolean;
  variant?: "default" | "related"; // New variant prop
}

const buildHref = (slug: string, countrySlug?: string | null) =>
  countrySlug ? `/${countrySlug}/blogs/${slug}` : `/blogs/${slug}`;

export function BlogCard({
  blog,
  countrySlug,
  className,
  featured = false,
  variant = "default",
}: BlogCardProps) {
  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  // Related Articles variant - clean card with prominent image
  if (variant === "related") {
    return (
      <Link
        href={buildHref(blog.slug, countrySlug)}
        className={cn(
          "group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border-2 border-slate-200 hover:border-primary flex flex-col transform hover:-translate-y-1",
          featured && "border-primary/80",
          className,
        )}
      >
        {/* Featured Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {blog.image ? (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/30">NWC</span>
            </div>
          )}
          {/* Date badge on image */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700 text-white text-xs font-semibold">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
          </div>
          {/* Hover overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {blog.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 w-fit">
              {blog.category}
            </span>
          )}
          <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {blog.title}
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
            {blog.excerpt}
          </p>

          <button className="inline-flex cursor-pointer   items-center justify-center gap-2 px-4 py-2 border-2 border-primary text-primary font-semibold text-sm rounded-lg hover:bg-primary/5 transition-colors duration-300 w-fit">
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Link>
    );
  }

  // Default variant - card with image on top, content below
  return (
    <Link
      href={buildHref(blog.slug, countrySlug)}
      className={cn(
        "group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border-2 border-primary/40 hover:border-primary flex flex-col transform hover:-translate-y-1",
        featured && "border-primary",
        className,
      )}
    >
      {/* Featured Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary/30">NWC</span>
          </div>
        )}
        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Date and Category badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700 text-white text-xs font-semibold">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
          {blog.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
              {blog.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
          {blog.excerpt}
        </p>

        {/* View Details Button */}
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-primary text-primary font-semibold text-sm rounded-lg hover:bg-primary/5 transition-colors duration-300 w-fit">
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
}
