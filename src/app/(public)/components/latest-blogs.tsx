import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { MoveRight, Calendar, ChevronRight } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

export type BlogItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  image?: string | null;
  publishedAt?: Date | null;
};

type BlogSectionProps = {
  blogs?: BlogItem[];
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

export default function BlogSection({ blogs }: BlogSectionProps) {
  const items = blogs && blogs.length ? blogs.slice(0, 4) : fallbackBlogs;
  const [featured, ...rest] = items;

  return (
    <section className="relative bg-slate-950 py-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/5 pb-8">
          <div className="max-w-2xl">
            <h2 className="section-title text-white">
              Latest <span className="text-primary">Updates</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
          {featured && (
            <article className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={featured.image || "/logo.svg"}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
              <div className="relative z-20 h-full flex flex-col justify-between p-6 md:p-8">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10">
                    Featured Story
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3 text-sm text-slate-300/80">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {featured.publishedAt
                        ? format(featured.publishedAt, "dd MMM yyyy")
                        : "Recent"}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                    {featured.title}
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base mb-6 line-clamp-2 max-w-lg">
                    {featured.excerpt || "Read the latest story from our team."}
                  </p>
                  <Link
                    href={`/blogs/${featured.slug}`}
                    className="flex items-center gap-2 text-white font-medium text-sm group/btn w-fit"
                  >
                    <span>Read Full Article</span>
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:scale-110 transition-all">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                </div>
              </div>
            </article>
          )}

          {rest.map((item) => (
            <article
              key={item.id}
              className="relative group rounded-3xl overflow-hidden bg-slate-900 border border-white/5 hover:border-white/10 transition-colors duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 mb-3 block">
                  {item.publishedAt
                    ? format(item.publishedAt, "dd MMM yyyy")
                    : "New"}
                </span>
                <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mt-2">
                  {item.excerpt || "Read more about this update."}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href={`/blogs/${item.slug}`}>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </article>
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
