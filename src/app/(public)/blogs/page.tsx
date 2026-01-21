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
      <Suspense fallback={<div className="h-96"></div>}>
        <section className="relative pt-14 overflow-hidden z-20">
          <div className="container mx-auto px-4 relative z-10">
            <BlogHero destinations={destinations} categories={categories} />
          </div>

          <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="py-8 bg-background relative z-0">
          <div className="container mx-auto px-4 relative">
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
        </div>

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

      <ReviewSection countrySlug={resolvedCountry.slug} />

      <RepresentativeVideoSlider videos={videos} />

      <CallToActionBanner />
    </div>
  );
}
