import { Suspense } from "react";
import { BlogListClient } from "./components/blog-list-client";
import { BlogHero } from "./components/blog-hero";
import { BlogSlider } from "./components/blog-slider";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { ReviewSection } from "@/components/sections/review-section";
import Image from "next/image";
import { resolveCountryContext } from "@/lib/country-resolver";
import { fetchBlogPageDataForClientFilter } from "@/lib/blogs";
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

// SSG with ISR - revalidate every 5 minutes for fresh content
export const revalidate = 300;
export const dynamicParams = true;

type PageProps = {
  params?: Promise<{ country?: string }>;
};

export default async function BlogsPage({ params }: PageProps) {
  const resolvedParams = (await params) ?? { country: null };
  const resolvedCountry = await resolveCountryContext(resolvedParams.country);

  const { destinations, featuredBlogs, allBlogs, sliderBlogs, categories } =
    await fetchBlogPageDataForClientFilter(resolvedCountry.slug);

  const videos = await fetchRepresentativeVideos(resolvedCountry.slug);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <Suspense fallback={<div className="h-96"></div>}>
        <section className="relative bg-primary/5 pt-24 pb-12 md:pt-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <BlogHero destinations={destinations} />
          </div>

          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        <section className="py-16 md:py-16 bg-background relative">
          <div className="container mx-auto px-4 relative z-10">
            <BlogListClient
              blogs={allBlogs}
              destinations={destinations}
              categories={categories}
              countrySlug={resolvedCountry.slug || "global"}
              itemsPerPage={9}
            />
          </div>

          {/* Floating elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-pulse delay-300" />
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-accent/10 rounded-full blur-2xl animate-pulse delay-600" />
        </section>

        <section className="py-12 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <BlogSlider
              posts={sliderBlogs}
              countrySlug={resolvedCountry.slug}
            />
          </div>
        </section>
      </Suspense>

      <ReviewSection />

      <RepresentativeVideoSlider videos={videos} />

      <CallToActionBanner />
    </div>
  );
}
