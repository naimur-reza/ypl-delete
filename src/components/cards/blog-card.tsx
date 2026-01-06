import { ArrowRight, Calendar, Clock } from "lucide-react";
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
    readTime?: string; // Optional if not in DB
    isFeatured?: boolean;
  };
  countrySlug?: string | null;
  className?: string;
  featured?: boolean;
}

const buildHref = (slug: string, countrySlug?: string | null) =>
  countrySlug ? `/${countrySlug}/blogs/${slug}` : `/blogs/${slug}`;

export function BlogCard({
  blog,
  countrySlug,
  className,
  featured = false,
}: BlogCardProps) {
  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <Link
      href={buildHref(blog.slug, countrySlug)}
      className={cn(
        "relative group rounded-4xl overflow-hidden bg-slate-900/40 border border-white/5 hover:border-primary/30 transition-all duration-500 flex flex-col justify-between",
        featured
          ? "md:col-span-2 md:row-span-2 min-h-[400px]"
          : "min-h-[300px]",
        className
      )}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-900/80 to-slate-900 z-10 pointer-events-none"></div>

      {/* Background Pattern/Image */}
      <div className="absolute inset-0 opacity-20 group-hover:scale-105 transition-transform duration-700">
        <Image
          src={blog.image || "/pattern.svg"}
          alt={blog.title}
          fill
          className="object-cover opacity-50"
        />
      </div>

      <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4 text-sm font-medium">
          {featured && (
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 backdrop-blur-md">
              Featured
            </span>
          )}
          <span className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-4 h-4" />
            {date}
          </span>
          {blog.readTime && (
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-4 h-4" />
              {blog.readTime}
            </span>
          )}
        </div>

        <h3
          className={cn(
            "font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors duration-300",
            featured ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"
          )}
        >
          {blog.title}
        </h3>

        <p
          className={cn(
            "text-slate-300 mb-6 line-clamp-3",
            featured ? "text-base md:text-lg max-w-xl" : "text-sm md:text-base"
          )}
        >
          {blog.excerpt}
        </p>

        <div className="flex items-center gap-2 text-white font-semibold group/btn w-fit">
          <span className="border-b-2 border-primary pb-0.5 group-hover/btn:border-white transition-colors">
            Read Article
          </span>
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
