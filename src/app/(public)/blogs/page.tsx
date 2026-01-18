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

  const { destinations, featuredBlogs, allBlogs, sliderBlogs } =
    await fetchBlogPageDataForClientFilter(resolvedCountry.slug);

  const videos = await fetchRepresentativeVideos(resolvedCountry.slug);

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-96"></div>}>
        <section className="relative bg-primary/5 pt-32 pb-12 md:pt-40 md:pb-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
             <BlogHero destinations={destinations} />
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

        <section className="py-16 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <BlogListClient
              blogs={allBlogs}
              destinations={destinations}
              countrySlug={resolvedCountry.slug || "global"}
              itemsPerPage={9}
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
