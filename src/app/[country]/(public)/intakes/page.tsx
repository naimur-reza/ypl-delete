import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCountryBySlug } from "@/lib/countries";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country } = await params;
  const countryData = await getCountryBySlug(country);
  const countryName = countryData?.name ?? country;
  return buildMetadata({
    title: `Intakes | ${countryName} | NWC Education`,
    description: `Explore available intakes for study abroad. Find January, May, and September intake deadlines and apply with NWC Education.`,
    url: `/${country}/intakes`,
  });
}

function formatIntake(intake: string): string {
  return intake.charAt(0) + intake.slice(1).toLowerCase();
}

export default async function IntakesListingPage({ params }: PageProps) {
  const { country: countrySlug } = await params;

  const country = await getCountryBySlug(countrySlug);
  if (!country) {
    notFound();
  }

  // Fetch intake seasons for this country
  const intakeSeasons = await prisma.intakeSeason.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { countries: { some: { countryId: country.id } } },
        { isGlobal: true },
      ],
    },
    include: {
      destination: {
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
        },
      },
      intakePages: {
        where: {
          status: "ACTIVE",
          OR: [
            { countries: { some: { countryId: country.id } } },
            { isGlobal: true },
          ],
        },
        select: {
          id: true,
          intake: true,
          destination: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
    orderBy: [
      { year: "desc" },
      { intake: "asc" },
    ],
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-secondary text-white py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Available Intakes
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Explore intakes for your study abroad journey. Choose a destination
            and intake to view full details, timelines, and how to apply.
          </p>
        </div>
      </section>

      {/* Cards grid */}
      <section className="max-w-6xl mx-auto py-12 md:py-16 px-4 md:px-8">
        {intakeSeasons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-600 text-lg">
              No intakes available for this country at the moment. Check back
              later or contact us for guidance.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {intakeSeasons.map((season) => {
              // Build the href using the intake season's destination
              const destinationSlug = season.destination?.slug;
              const intakeMonth = season.intake;
              
              // Link to the intake details page
              const href = destinationSlug && intakeMonth
                ? `/${countrySlug}/${destinationSlug}/${intakeMonth.toLowerCase()}`
                : null;

              const CardContent = (
                <div className="p-6 flex-1 flex flex-col">
                  {/* Background Image */}
                  {season.backgroundImage && (
                    <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={season.backgroundImage}
                        alt={season.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Destination */}
                  {season.destination && (
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-slate-900">
                        {season.destination.name.replace(/^Study\s+in\s+/i, "").trim()}
                      </span>
                    </div>
                  )}
                  
                  {/* Intake & Year */}
                  <div className="flex items-center gap-2 text-slate-600 text-sm mb-3">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      {formatIntake(season.intake)} {season.year}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {season.title}
                  </h2>
                  
                  {/* Subtitle/Description */}
                  {season.subtitle && (
                    <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                      {season.subtitle}
                    </p>
                  )}
                  
                  {/* Deadline */}
                  {season.applicationDeadline && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 mb-4">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>
                        Deadline: {new Date(season.applicationDeadline).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric" 
                        })}
                      </span>
                    </div>
                  )}
                  
                  {/* CTA */}
                  <span className="inline-flex items-center gap-2 text-primary font-semibold mt-auto group-hover:gap-3 transition-all">
                    {href ? "View Details" : "Learn More"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              );

              // Always make cards clickable - fallback to apply-now or contact page if no specific destination
              const fallbackHref = season.ctaUrl || "/apply-now";
              const cardHref = href || fallbackHref;

              return (
                <Link
                  key={season.id}
                  href={cardHref}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
                >
                  {CardContent}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
