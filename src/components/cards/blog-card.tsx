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
          "group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-primary/20 flex flex-col transform hover:scale-[1.03] hover:-translate-y-2",
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
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/30">NWC</span>
            </div>
          )}
          {/* Date badge on image */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 shadow-sm border border-white/20">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </span>
            {blog.category && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/90 to-primary text-white text-xs font-medium shadow-sm">
                {blog.category}
              </span>
            )}
          </div>
          {/* Hover overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 group-hover:translate-x-1 transform">
            {blog.title}
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1 group-hover:text-slate-700 transition-colors duration-300">
            {blog.excerpt}
          </p>

          <div className="flex items-center gap-1.5 text-primary font-semibold text-sm group/btn">
            <span className="group-hover/btn:underline underline-offset-4 group-hover/btn:translate-x-1 transition-all duration-300">
              Read More
            </span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    );
  }

  // Default variant - overlay style with enhanced design
  return (
    <Link
      href={buildHref(blog.slug, countrySlug)}
      className={cn(
        "relative group rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-primary/40 transition-all duration-500 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-[1.02] hover:-translate-y-1",
        featured ? "min-h-[420px]" : "min-h-[320px]",
        className,
      )}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/10 via-transparent to-accent/10 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse delay-300" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Background Image with better visibility */}
      <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700 ease-out">
        <Image
          src={blog.image || "/pattern.svg"}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Multi-layer linear for depth - cleaner look */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Top bar with badges */}
      <div className="relative z-20 p-5 flex items-center gap-3 flex-wrap">
        {featured && (
          <span className="px-3 py-1.5 rounded-full bg-linear-to-r from-primary to-primary/90 text-white text-xs font-semibold shadow-lg shadow-primary/25 animate-pulse">
            Featured
          </span>
        )}
        {blog.category && (
          <span className="px-3 py-1.5 rounded-full bg-linear-to-r from-secondary to-secondary/90 text-white text-xs font-semibold shadow-lg shadow-secondary/25">
            {blog.category}
          </span>
        )}
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-medium border border-white/10">
          <Calendar className="w-3.5 h-3.5" />
          {date}
        </span>
      </div>

      {/* Content at bottom */}
      <div className="relative z-20 p-6 pt-0 flex flex-col">
        <h3
          className={cn(
            "font-bold text-white mb-3 leading-tight group-hover:text-primary transition-colors duration-300 group-hover:translate-x-1 transform",
            featured ? "text-2xl md:text-3xl" : "text-xl",
          )}
        >
          {blog.title}
        </h3>

        <p
          className={cn(
            "text-slate-300/90 mb-5 line-clamp-2 group-hover:text-white/90 transition-colors duration-300",
            featured ? "text-base" : "text-sm",
          )}
        >
          {blog.excerpt}
        </p>

        <div className="flex items-center gap-2 text-primary font-semibold text-sm w-fit group/btn">
          <span className="group-hover/btn:underline underline-offset-4 group-hover/btn:translate-x-1 transition-all duration-300">
            Read Article
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}
