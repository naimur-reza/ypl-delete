import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ApplyNowForm } from "@/components/ApplyNowForm";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
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
  const { office_slug , country: country_slug} = await params;

  const destinations = await prisma.destination.findMany({
    where: { countries: {some: {country: {slug: country_slug}}} },
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
  const openingHours = data.openingHours as Record<string, any> | null;

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
              
              {/* Main Content Area */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Best Study Abroad and Education Consultants in {data.name}
                </h2>

                {/* NOTE: Your JSON shows 'content' as JS export strings. 
                    If it's actually HTML, this will work. If it's code, it will render as plain text. */}
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

                  {/* Dynamic Opening Hours from JSON */}
                  {openingHours && (
                    <div className="flex items-start gap-4 md:col-span-2 border-t border-border pt-6 mt-2">
                      <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="w-full">
                        <h4 className="font-semibold text-foreground mb-3">Opening Hours</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                            const hours = openingHours[day];
                            const isClosed = !hours || hours.closed === true;
                            
                            return (
                              <div key={day} className="flex justify-between items-center py-1 border-b border-border/40 last:border-0">
                                <span className="font-medium capitalize text-muted-foreground">{day}</span>
                                <span className={`font-semibold ${isClosed ? 'text-destructive' : 'text-foreground'}`}>
                                  {isClosed ? "Closed" : `${hours.open} - ${hours.close}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Section */}
              {data.mapEmbedUrl && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-6">Location Map</h3>
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                    <iframe
                      src={data.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title={`Map of ${data.name}`}
                    />
                  </div>
                  {data.address && (
                    <div className="mt-4">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in Google Maps
                      </a>
                    </div>
                  )}
                </div>
              )}
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