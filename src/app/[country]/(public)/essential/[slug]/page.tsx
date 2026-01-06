import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { extractHeadings } from "@/lib/toc-utils";
import CallToActionBanner from "@/components/CallToActionBanner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const essential = await prisma.essentialStudy.findUnique({
    where: { slug: (await params).slug },
    select: { title: true, description: true },
  });

  if (!essential) {
    return { title: "Essential Study Not Found" };
  }

  return {
    title: essential.title,
    description: essential.description || undefined,
  };
}

// Estimate reading time based on word count
function estimateReadingTime(content: string): number {
  if (!content) return 4;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default async function EssentialStudyPage({ params }: Props) {
  const essential = await prisma.essentialStudy.findUnique({
    where: { slug: (await params).slug },
    include: { destination: true },
  });

  if (!essential) return notFound();

  // Extract TOC headings from content
  const headings = extractHeadings(essential.content || "");
  const readingTime = estimateReadingTime(essential.content || "");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/90 via-primary to-primary/80 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/study-abroad"
                className="hover:text-white transition-colors"
              >
                Study Abroad
              </Link>
              <span>/</span>
              <span className="text-white">{essential.title}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {essential.title}
            </h1>

            {essential.description && (
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                {essential.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{readingTime} min read</span>
              </div>
              {essential.destination && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{essential.destination.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with 3-Column Layout */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 lg:gap-12 items-start">
            {/* Left Sidebar - TOC (hidden on mobile) */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
                <TableOfContents headings={headings} />
              </aside>
            )}

            {/* Center - Main Content */}
            <article
              className={`flex-1 min-w-0 ${
                headings.length === 0 ? "max-w-4xl mx-auto" : "max-w-3xl"
              }`}
            >
              {/* Content rendered with blog-like styling */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
                <MarkdownContent
                  content={essential.content || ""}
                  generateIds
                />
              </div>
            </article>

            {/* Right Sidebar - Quick Actions (hidden on mobile) */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
                <div className="bg-linear-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
                  <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get personalized guidance from our expert counselors
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Book Free Consultation
                  </Link>
                </div>

                <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h4 className="font-semibold mb-3 text-sm">
                    Share this guide
                  </h4>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CallToActionBanner />
    </div>
  );
}
