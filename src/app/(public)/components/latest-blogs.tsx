import Link from "next/link";
import { MoveRight } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { BlogCard } from "@/components/cards/blog-card";

export type BlogItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  image?: string | null;
  publishedAt?: Date | null;
  category?: string | null;
};

type BlogSectionProps = {
  blogs?: BlogItem[];
  countrySlug?: string | null;
};

const fallbackBlogs: BlogItem[] = [
  {
    id: "fallback-1",
    slug: "#",
    title: "Latest updates from our global offices",
    excerpt:
      "News, rankings, and success stories from international education.",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date(),
  },
];

export default function BlogSection({ blogs, countrySlug }: BlogSectionProps) {
  const items = blogs && blogs.length ? blogs.slice(0, 3) : fallbackBlogs;

  return (
    <section className="relative bg-slate-950 py-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/5 pb-8">
          <div className="max-w-2xl">
            <h2 className="section-title text-white">
              Latest <span className="text-primary">Updates</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              News, rankings, and success stories tailored to your destination.
            </p>
          </div>
          <div className="hidden md:block">
            <GradientButton className="px-6 py-2.5 text-sm group" asChild>
              <Link href="/blogs">
                View all news
                <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </GradientButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={{
                ...blog,
                publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : null,
                excerpt: blog.excerpt || null,
                image: blog.image || null,
              }}
              countrySlug={countrySlug}
              className="bg-slate-900 border-white/10 hover:border-primary/50 transition-all duration-300 shadow-xl"
            />
          ))}
        </div>

        <div className="mt-10 md:hidden flex justify-center">
          <GradientButton className="w-full justify-center" asChild>
            <Link href="/blogs">
              View all news
              <MoveRight className="ml-2 w-5 h-5" />
            </Link>
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
