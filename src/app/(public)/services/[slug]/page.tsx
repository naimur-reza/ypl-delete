import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DynamicHero } from "@/components/hero/DynamicHero";
import { FaqSection } from "../../components/faq-section";
import { ReviewSection } from "@/components/sections/review-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Generate static params for all services
export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
  });

  return services.map((service) => ({
    slug: service.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const service = await prisma.service.findFirst({
    where: { slug, status: "ACTIVE" },
  });

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.metaTitle || `${service.title} | NWC Education`,
    description: service.metaDescription || service.summary || `Learn about our ${service.title} service`,
    keywords: service.metaKeywords || undefined,
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const service = await prisma.service.findFirst({
    where: { slug, status: "ACTIVE" },
  });

  if (!service) {
    notFound();
  }

  // Parse stats from JSON
  const stats = (service.stats as Array<{ label: string; value: string }>) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <DynamicHero
        slug={slug}
        countrySlug={null}
        defaultTitle={service.heroTitle || service.title}
        defaultSubtitle={service.heroSubtitle || service.summary || ""}
        defaultBackgroundUrl={service.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070"}
      />

      {/* Stats Section */}
      {stats.length > 0 && (
        <div className="bg-[#0a1628] py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base text-white/80">
                      {stat.label}
                    </div>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-24 bg-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Service Content */}
      {service.content && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <MarkdownContent
                content={service.content}
                className="prose prose-lg max-w-none"
              />
            </div>
          </div>
        </section>
      )}

      {/* Review Section */}
      <ReviewSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Call to Action */}
      <CallToActionBanner />
    </div>
  );
}
