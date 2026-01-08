import { BlogCard } from "@/components/cards/blog-card";
import { BlogFilter } from "./components/blog-filter";
import { BlogSlider } from "./components/blog-slider";
import { Pagination } from "@/components/ui/pagination";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { ReviewSection } from "@/components/sections/review-section";
import Image from "next/image";
import { resolveCountryContext } from "@/lib/country-resolver";
import { fetchBlogPageData } from "@/lib/blogs";
import { fetchRepresentativeVideos } from "@/lib/representative-videos";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: "Blogs & Study Guides | NWC Education",
    description:
      "Explore our latest articles, study guides, and news about studying abroad.",
    url: "/blogs",
  });

// Keep dynamic for searchParams support, but with short revalidation
export const revalidate = 300;
export const dynamicParams = true;

type PageProps = {
  params?: Promise<{ country?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogsPage({ params, searchParams }: PageProps) {
  const resolvedParams = (await params) ?? { country: null };
  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams.search as string) || "";
  const currentPage = parseInt(
    (resolvedSearchParams.page as string) || "1",
    10
  );

  const resolvedCountry = await resolveCountryContext(resolvedParams.country);

  // Handle "All" filter - check if all param is set
  const isAllSelected = resolvedSearchParams.all === "true";
  const countryFilter = isAllSelected
    ? "All"
    : (resolvedSearchParams.country as string) || resolvedCountry.name || "All";

  const {
    countries,
    featuredBlogs,
    blogs,
    sliderBlogs,
    totalCount,
    totalPages,
  } = await fetchBlogPageData({
    countrySlug: resolvedCountry.slug,
    countryFilterName: countryFilter,
    searchQuery,
    page: currentPage,
    limit: 9,
  });

  const videos = await fetchRepresentativeVideos(resolvedCountry.slug);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-primary/5 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Advice from our <br />
              experts at <span className="text-primary">NWC</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
              Discover comprehensive guides, expert tips, and the latest news to
              help you navigate your international education journey.
            </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      <section className="py-12 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Image
            src="/pattern.svg"
            alt="Background Pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <BlogSlider posts={sliderBlogs} countrySlug={resolvedCountry.slug} />
        </div>
      </section>

      {featuredBlogs.length > 0 && (
        <section className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Browse study guides <br />
                relevant to your interests
              </h2>
              <p className="text-slate-400 max-w-2xl">
                Curated content to help you make informed decisions about your
                future.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  countrySlug={resolvedCountry.slug}
                  className="h-full"
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <BlogFilter
            countries={countries}
            initialCountry={
              resolvedSearchParams.country
                ? (resolvedSearchParams.country as string)
                : resolvedCountry.name
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length ? (
              blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  countrySlug={resolvedCountry.slug}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-lg">
                  No study guides found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            itemName="articles"
          />
        </div>
      </section>

      <ReviewSection />

      <RepresentativeVideoSlider videos={videos} />

      <CallToActionBanner />
    </div>
  );
}
