import Link from "next/link";
import { Calendar, User } from "lucide-react";
import Image from "next/image";

interface BlogCardProps {
  post: any; // Using any to support both static data and DB models
}

export function BlogCard({ post }: BlogCardProps) {
  const href = `/insights/${post.slug || post.id}`;
  const dateStr = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString() 
    : post.date;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md h-full flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={post.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
          {post.category}
        </div>

        <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-primary line-clamp-2 leading-snug">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-1">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{dateStr}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
