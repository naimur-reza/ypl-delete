import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ApplyNowForm } from "@/components/ApplyNowForm";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Metadata } from "next";
import { MarkdownContent } from "@/components/ui/markdown-content";

type PageProps = {
  params: Promise<{
    country: string;
    office_slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
    description: data.metaDescription || `Visit NWC Education office in ${data.name}. Expert study abroad consultation.`,
    keywords: data.metaKeywords || undefined,
  };
}

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
      {/* Hero Section */}
      <section className="relative bg-background border-b border-border/40">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {country && (
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6 transition-colors hover:bg-primary/20">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">{country.name}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              {data.name}
            </h1>
            {data.subtitle && (
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Contact Information */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.address && (
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Address</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{data.address}</p>
                      </div>
                    </div>
                  )}

                  {data.email && (
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Email</h4>
                        <a href={`mailto:${data.email}`} className="text-sm text-primary hover:underline">{data.email}</a>
                      </div>
                    </div>
                  )}

                  {data.phone && (
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                        <a href={`tel:${data.phone}`} className="text-sm text-primary hover:underline">{data.phone}</a>
                      </div>
                    </div>
                  )}

 
                </div>
              </div>

              {/* Map Section */}
              {data.mapUrl && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-6">Location Map</h3>
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                    <iframe
                      src={(() => {
                        if (!data.mapUrl) return "";
                        
                        // Extract src from iframe if provided
                        if (data.mapUrl.includes('<iframe')) {
                          const srcMatch = data.mapUrl.match(/src="([^"]+)"/) || data.mapUrl.match(/src='([^']+)'/);
                          if (srcMatch && srcMatch[1]) return srcMatch[1];
                        }
                        
                        // If it's already an embed URL, return it
                        if (data.mapUrl.includes('/embed') || data.mapUrl.includes('output=embed')) {
                          return data.mapUrl;
                        }

                        // Fallback: treat as query
                        return `https://maps.google.com/maps?q=${encodeURIComponent(data.mapUrl)}&output=embed`;
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
                    <button
                      onClick={() => {
                        const rawUrl = data.mapUrl;
                        if (!rawUrl) return;
                        const url = rawUrl.includes('<iframe') 
                          ? (rawUrl.match(/src="([^"]+)"/)?.[1] || rawUrl)
                          : rawUrl;
                        window.open(url as string, '_blank');
                      }}
                      className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Google Maps
                    </button>
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Best Study Abroad and Education Consultants in {data.name}
                </h2>

                {data.content ? (
                  <MarkdownContent
                    content={data.content}
                    className="prose-lg max-w-none text-muted-foreground"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    NWC {data.name} is the leading study abroad and education consultant in{" "}
                    {data.name}{country ? `, ${country.name}` : ""}.
                  </p>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ApplyNowForm
                destinations={destinations}
                  countryId={country?.id}
                  officeSlug={data.slug}
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
