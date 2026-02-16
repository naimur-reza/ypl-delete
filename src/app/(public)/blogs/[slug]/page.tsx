import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { extractHeadings } from "@/lib/toc-utils";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogCTASidebar } from "@/components/blog/blog-cta-sidebar";
import { RelatedArticles } from "@/components/blog/related-articles";
import { ReviewSection } from "@/components/sections/review-section";
import CallToActionBanner from "@/components/CallToActionBanner";

// SSG with ISR - revalidate every 5 minutes
export const revalidate = 3600;
export const dynamicParams = true;

// Pre-generate first 50 most recent blogs at build time for instant loading
export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    select: { slug: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      excerpt: true,
    },
  });

  if (!blog) {
    return { title: "Blog Not Found" };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt || undefined,
    keywords: blog.metaKeywords || undefined,
  };
}

// Estimate reading time based on word count
function estimateReadingTime(content: string): number {
  if (!content) return 4;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      destination: { select: { id: true, name: true } },
      countries: { include: { country: true } },
    },
  });

  if (!blog) {
    notFound();
  }

  // Extract TOC headings from content
  const headings = extractHeadings(blog.content || "");
  const countrySlug = blog.countries[0]?.country?.slug || null;
  const readingTime = estimateReadingTime(blog.content || "");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <BlogHero
        title={blog.title}
        publishedAt={blog.publishedAt}
        readingTime={readingTime}
      />

      {/* Main Content with 3-Column Layout */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 lg:gap-12 items-start">
            {/* Left Sidebar - TOC (hidden on mobile) */}
            <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
              <TableOfContents headings={headings} />
            </aside>

            {/* Center - Main Content */}
            <article className="flex-1 min-w-0 max-w-3xl">
              {/* Featured Image at top of content */}
              {blog.image && (
                <div className="mb-10">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              )}

              <MarkdownContent content={blog.content || ""} generateIds />
            </article>

            {/* Right Sidebar - CTA (hidden on mobile) */}
            <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
              <BlogCTASidebar />
            </aside>
          </div>
        </div>
      </section>
            {/* Related Articles */}
      <RelatedArticles
        currentBlogId={blog.id}
        destinationId={blog.destinationId}
        countrySlug={countrySlug}
      />

      {/* Student Reviews & GMB Reviews */}
      <ReviewSection countrySlug={countrySlug} />



      {/* CTA Banner */}
      <CallToActionBanner />
    </div>
  );
}
