import Link from "next/link";
import { Calendar, User } from "lucide-react";
import type { BlogPost } from "@/lib/data";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/insights/${post.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="aspect-video bg-muted">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
          <span className="text-5xl font-bold text-primary/20">
            {post.title[0]}
          </span>
        </div>
      </div>

      <div className="p-6">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {post.category}
        </span>

        <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{post.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
