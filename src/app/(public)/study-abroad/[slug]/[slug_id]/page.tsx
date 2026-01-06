import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Share2 } from "lucide-react";
 
import { ReviewSection } from "@/components/sections/review-section";
import { BlogSection } from "@/app/(public)/components";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface PageProps {
  params: Promise<{
    slug: string; // Destination slug
    slug_id: string; // Essential Study slug
  }>;
}

export default async function EssentialStudyDetailsPage({ params }: PageProps) {
  const { slug, slug_id } = await params;

  if (!slug || !slug_id) {
    return notFound();
  }

  // Fetch the essential study item
  const essentialStudy = await prisma.essentialStudy.findUnique({
    where: { slug: slug_id },
    include: {
      destination: true,
    },
  });

  if (!essentialStudy) {
    return notFound();
  }

  // Fetch other essential study items for the sidebar navigation
  const otherEssentials = await prisma.essentialStudy.findMany({
    where: {
      destinationId: essentialStudy.destinationId,
      id: { not: essentialStudy.id }, // Exclude current
    },
    select: {
      title: true,
      slug: true,
    },
  });

  // Capitalize country for display
  // Capitalize country for display (using slug as country/destination name)
  const countryName = slug.toUpperCase() === "UK" || slug.toUpperCase() === "USA"
    ? slug.toUpperCase()
    : slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1636772359335-eed83f7675a8?q=100&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt={essentialStudy.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${slug}/study-abroad/${slug}`} className="hover:text-white transition-colors">Study Abroad</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{essentialStudy.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight">
            {essentialStudy.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900">More Information</h3>
              </div>
              <nav className="flex flex-col">
                {/* Current Item (Active) */}
                <Link
                  href="#"
                  className="px-4 py-3 text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 border-l-4 border-primary flex items-center justify-between"
                >
                  {essentialStudy.title}
                  <ChevronRight className="w-4 h-4" />
                </Link>

                {/* Other Items */}
                {otherEssentials.map((item) => (
                  <CountryAwareLink
                    key={item.slug}
                    href={`/study-abroad/${slug}/${item.slug}`}
                    className="px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4   hover:border-slate-300 transition-all flex items-center justify-between border-b border-slate-100 last:border-0"
                  >
                    {item.title}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                  </CountryAwareLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {countryName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{essentialStudy.title}</h2>
                    <p className="text-slate-500 text-sm">Updated recently</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-sm shadow-red-200">
                    Apply Now
                  </button>
                  <button className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              <div className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 hover:prose-a:text-blue-700">
                {/* Render content with markdown styling */}
                {essentialStudy.content ? (
                  <MarkdownContent content={essentialStudy.content} generateIds />
                ) : (
                  <>
                    <h3>Overview</h3>
                    <p>
                      {essentialStudy.description || "Detailed information about this topic will be available soon."}
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h3>Key Highlights</h3>
                    <ul>
                      <li>Comprehensive guide for international students</li>
                      <li>Step-by-step application process</li>
                      <li>Important deadlines and requirements</li>
                      <li>Tips for a successful journey</li>
                    </ul>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <ReviewSection />
      <BlogSection />
    </div>
  );
}
