import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog-card";
import { blogPosts as initialBlogPosts } from "@/lib/data";
import { connectDB } from "@/lib/mongodb";
import Insight from "@/lib/models/insight";

const categories = [
  "All",
  "Career Advice",
  "Workplace Trends",
  "Workplace Culture",
  "Industry Insights",
];

export default async function InsightsPage() {
  await connectDB();
  const dbInsights = await Insight.find({ isActive: true })
    .sort({ order: 1, publishedAt: -1 })
    .lean();
  const insights =
    dbInsights.length > 0
      ? JSON.parse(JSON.stringify(dbInsights))
      : initialBlogPosts;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
            Latest Articles
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl">
            Insights & Resources
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-secondary-foreground/80">
            Expert advice, industry trends, and career guidance to help you
            navigate the world of work.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={
                  category === "All"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-border bg-transparent hover:bg-muted"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((post: any) => (
              <BlogCard key={post._id || post.id} post={post} />
            ))}
            {insights.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground  ">
                No insights found. Check back soon for new articles.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Stay Updated
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Subscribe to our newsletter for the latest insights, job market
              updates, and career advice delivered to your inbox.
            </p>
            <div className="mt-8">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/contact">Subscribe Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
