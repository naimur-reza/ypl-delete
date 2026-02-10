import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookConsultationFormInline } from "@/components/BookConsultationFormInline";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import { Metadata } from "next";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { OpeningHoursDisplay } from "@/components/ui/opening-hours";
import { OpeningHoursData } from "@/components/ui/opening-hours";
import { ViewOnMapButton } from "@/app/(public)/global-branches/components/view-on-map-button";
import Image from "next/image";

type PageProps = {
  params: Promise<{
    country: string;
    office_slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { office_slug } = await params;
  const data = await prisma.globalOffice.findUnique({
    where: { slug: office_slug },
    include: {
      countries: {
        include: { country: true },
      },
    },
  });

  if (!data) return { title: "Office Not Found" };

  const countryName = data.countries[0]?.country?.name || "Global Office";

  return {
    title: data.metaTitle || `${data.name} - ${countryName} | NWC Education`,
    description:
      data.metaDescription ||
      `Visit NWC Education office in ${data.name}. Expert study abroad consultation.`,
    keywords: data.metaKeywords || undefined,
  };
}

export async function generateStaticParams() {
  const offices = await prisma.globalOffice.findMany({
    include: {
      countries: {
        include: { country: true },
      },
    },
  });

  const params: { country: string; office_slug: string }[] = [];

  for (const office of offices) {
    for (const relation of office.countries) {
      if (relation.country) {
        params.push({
          country: relation.country.slug,
          office_slug: office.slug,
        });
      }
    }
  }

  return params;
}

// Allow dynamic routes not in generateStaticParams
export const dynamicParams = true;

// Revalidate every hour
export const revalidate = 3600;

export default async function GlobalOfficePage({ params }: PageProps) {
  const { office_slug, country: country_slug } = await params;

  const destinations = await prisma.destination.findMany({
    where: { countries: { some: { country: { slug: country_slug } } } },
  });

  const data = await prisma.globalOffice.findUnique({
    where: { slug: office_slug },
    include: {
      countries: {
        include: { country: true },
      },
    },
  });

  if (!data) notFound();

  const country = data.countries[0]?.country;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Banner Image */}
      <section className="relative bg-slate-900 text-white min-h-[400px] md:min-h-[500px]">
        {/* Background Banner Image or Gradient */}
        {data.bannerImage ? (
          <div className="absolute inset-0">
            <Image
              src={data.bannerImage}
              alt={`${data.name} Banner`}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 via-slate-900/50 to-slate-900/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-slate-900 to-slate-900" />
        )}

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {country && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-1.5 rounded-full mb-6 border border-white/20">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">
                  {country.name}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              {data.name}
            </h1>
            {data.subtitle && (
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Office Image Section */}
      {data.image && (
        <section className="relative">
          <div className="container mx-auto px-4 -mt-12 relative z-20">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
              <div className="aspect-video md:aspect-21/9 relative">
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className={`py-12 md:py-16 ${data.image ? "pt-8" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.address && (
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Address
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {data.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.email && (
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Email
                        </h4>
                        <a
                          href={`mailto:${data.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {data.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {data.phone && (
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Phone
                        </h4>
                        <a
                          href={`tel:${data.phone}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {data.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Opening Hours */}
              {data.openingHours && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <OpeningHoursDisplay
                    data={data.openingHours as OpeningHoursData}
                  />
                </div>
              )}

              {/* Map Section */}
              {data.mapUrl && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Location Map
                  </h3>
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                    <iframe
                      src={(() => {
                        if (!data.mapUrl) return "";

                        // Extract src from iframe if provided
                        if (data.mapUrl.includes("<iframe")) {
                          const srcMatch =
                            data.mapUrl.match(/src="([^"]+)"/) ||
                            data.mapUrl.match(/src='([^']+)'/);
                          if (srcMatch && srcMatch[1]) return srcMatch[1];
                        }

                        // If it's already an embed URL, return it
                        if (
                          data.mapUrl.includes("/embed") ||
                          data.mapUrl.includes("output=embed")
                        ) {
                          return data.mapUrl;
                        }

                        // Fallback: treat as query
                        return `https://maps.google.com/maps?q=${encodeURIComponent(
                          data.mapUrl,
                        )}&output=embed`;
                      })()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title={`Map of ${data.name}`}
                    />
                  </div>
                  <div className="mt-4">
                    <ViewOnMapButton mapUrl={data.mapUrl} />
                  </div>
                </div>
              )}
              {/* Content Section */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                {data.content ? (
                  <MarkdownContent
                    content={data.content}
                    className="prose-lg max-w-none text-muted-foreground"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    NWC {data.name} is the leading study abroad and education
                    consultant in {data.name}
                    {country ? `, ${country.name}` : ""}. Our team of
                    experienced counselors is dedicated to helping students
                    achieve their dreams of studying abroad at top universities
                    worldwide.
                  </p>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookConsultationFormInline
                  destinations={destinations}
                  countryId={country?.id}
                  officeSlug={data.slug}
                  defaultCountry={country?.name}
                  headerTitle="Apply Now"
                  headerSubtitle="Fill out the form below and our team will get back to you shortly."
                  singleColumn={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
