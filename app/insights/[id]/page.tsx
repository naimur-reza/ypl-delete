import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts as initialBlogPosts } from "@/lib/data";
import { connectDB } from "@/lib/mongodb";
import Insight from "@/lib/models/insight";
import mongoose from "mongoose";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";

interface InsightDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { id } = await params;
  await connectDB();

  // Try to find in DB first
  let post: any = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    post = await Insight.findById(id).lean();
  } else {
    post = await Insight.findOne({ slug: id }).lean();
  }

  // Fallback to static data for initial posts if not found in DB
  if (!post) {
    post = initialBlogPosts.find((p) => p.id === id);
  }

  if (!post) {
    notFound();
  }

  // Convert to plain object for React
  post = JSON.parse(JSON.stringify(post));

  // Fetch related posts from DB or fallback
  let relatedPosts: any[] = [];
  const dbRelated = await Insight.find({ 
    isActive: true, 
    _id: { $ne: post._id }, 
    category: post.category 
  }).limit(2).lean();

  if (dbRelated.length > 0) {
    relatedPosts = JSON.parse(JSON.stringify(dbRelated));
  } else {
    relatedPosts = initialBlogPosts
      .filter((p) => p.id !== (post._id || post.id) && p.category === post.category)
      .slice(0, 2);
  }

  return (
    <>
      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Insights
          </Link>

          <div className="mt-6">
            <span className="inline-block rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-medium text-primary-foreground">
              {post.category}
            </span>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-6 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : post.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <article className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-lg text-muted-foreground whitespace-pre-wrap">
                  {post.excerpt}
                </p>

                <div className="mt-8">
                  <SafeHtmlContent content={post.content} />
                </div>
              </div>

              <div className="mt-12 border-t border-border pt-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <span className="font-semibold text-foreground">
                      {post.author
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {post.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Content Writer at YPL
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <aside>
              <div className="sticky top-24">
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground">
                    Need Career Advice?
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our team of experts is here to help you navigate your career
                    journey.
                  </p>
                  <Button className="mt-4 w-full" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-foreground">
                      Related Articles
                    </h3>
                    <div className="mt-4 space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost._id || relatedPost.id}
                          href={`/insights/${relatedPost.slug || relatedPost.id}`}
                          className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20"
                        >
                          <p className="font-medium text-foreground line-clamp-2">
                            {relatedPost.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {relatedPost.publishedAt ? new Date(relatedPost.publishedAt).toLocaleDateString() : relatedPost.date}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  await connectDB();
  const dbPosts = await Insight.find({ isActive: true }).select("slug").lean();
  const staticParams = dbPosts.map((post) => ({
    id: post.slug,
  }));
  
  // Also add IDs from initialBlogPosts to avoid breaking build if DB is empty
  initialBlogPosts.forEach(p => {
    staticParams.push({ id: p.id });
  });

  return staticParams;
}
