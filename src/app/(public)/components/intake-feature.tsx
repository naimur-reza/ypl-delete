import { prisma } from "@/lib/prisma";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

export async function IntakeFeature({
  countrySlug,
  destinationId,
}: {
  countrySlug?: string;
  destinationId?: string;
  buttonTitle?: "View details";
  buttonUrl?: string;
}) {
  // Fetch the currently active intake season
  // If countrySlug is provided, check if the season applies to that country
  const season = await prisma.intakeSeason.findFirst({
    where: {
      status: "ACTIVE",
      // If season has no countries specified, it applies to all
      // If it has countries, check if our country is in the list
      OR: [
        { countries: { none: {} } }, // Global season (no countries specified)
        countrySlug
          ? {
              countries: {
                some: {
                  country: { slug: countrySlug },
                },
              },
            }
          : {},
      ],
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      backgroundImage: true,
      ctaLabel: true,
      ctaUrl: true,
      intake: true,
      year: true,
      applicationDeadline: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const intakePage = season
    ? await prisma.intakePage.findFirst({
        where: {
          destinationId: destinationId,
        },
        include: {
          destination: {
            select: {
              slug: true,
            },
          },
        },
      })
    : null;

  // If no active season, don't render anything
  if (!season) {
    return null;
  }

  const backgroundImage =
    season.backgroundImage ||
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section
      className="relative py-8 sm:py-12 md:py-14 px-4 sm:px-6 md:px-8 overflow-hidden rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 md:mx-8 my-4 sm:my-6 md:my-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "right center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-secondary via-secondary/80 to-secondary/40 rounded-2xl sm:rounded-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div>
          {/* Subtitle with red accent */}
          {season.subtitle && (
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 sm:w-1.5 h-8 sm:h-10 bg-primary rounded-full"></div>
              <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                {season.subtitle}
              </span>
            </div>
          )}

          {/* Main headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            {season.title}
          </h2>

          {/* Description */}
          {season.description && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium leading-relaxed mb-6 sm:mb-8">
              {season.description}
            </p>
          )}

          {/* CTA Button */}
          {intakePage?.destinationId ? (
            <CountryAwareLink
              href={
                countrySlug
                  ? `/${intakePage?.destination?.slug}/${intakePage.intake.toLowerCase()}`
                  : `/intake/${intakePage.destination.slug}/${intakePage.intake.toLowerCase()}`
              }
              className="bg-primary hover:bg-primary/90 active:bg-primary/80 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 md:px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-base sm:text-lg cursor-pointer inline-block touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              View Details
            </CountryAwareLink>
          ) : (
            <>
              <CountryAwareLink
                href={season.ctaUrl || "/apply-now"}
                className="bg-primary hover:bg-primary/90 active:bg-primary/80 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 md:px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-base sm:text-lg cursor-pointer inline-block touch-manipulation min-h-[44px] flex items-center justify-center"
              >
                {season.ctaLabel || "Apply Now"}
              </CountryAwareLink>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
