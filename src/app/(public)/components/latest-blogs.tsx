import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { MoveRight, Calendar, ChevronRight } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { BlogCard } from "@/components/cards/blog-card";
import { Blog } from "../../../../prisma/src/generated/prisma/client";
 

 

const fallbackBlogs = [
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

export default function BlogSection({ blogs }: {blogs: Blog[]}) {
 
  const featuredBlogs = blogs?.filter((blog) => blog.isFeatured) || fallbackBlogs;

  return (
    <section className="relative bg-gray-50 py-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/5 pb-8">
          <div className="max-w-2xl">
            <h2 className="section-title text-black">
              Latest <span className="text-primary">Updates</span>
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              News, rankings, and success stories tailored to this country.
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ">

{featuredBlogs?.map((blog) => (
  <BlogCard key={blog.id} blog={blog} />
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
