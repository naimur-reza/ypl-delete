import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

export async function StudyAbroadCountries({
  countrySlug,
}: {
  countrySlug: string;
}) {
  const destinations = await prisma.destination.findMany({
    where: {
      countries: {
        some: {
          country: { slug: countrySlug },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <section className="py-20 px-4 md:px-8  ">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="w-12 h-1.5 bg-primary mb-3 rounded-full"></div>
          <h2 className="section-title">Explore Our Destinations</h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Begin an exciting academic journey in these varied and welcoming
            study locations!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, index) => {
            return (
              <CountryAwareLink
                href={`/study-abroad/${dest.slug}`}
                key={dest.id}
                className="group relative block h-[450px] w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ease-in-out border border-transparent hover:border-blue-100"
              >
                {/* Background Image */}
                <Image
                  src={dest.thumbnail || "/placeholder-country.jpg"}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Default Overlay: Just the name in the center */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
                  <h3 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                    {dest.name}
                  </h3>
                </div>

                {/* Hover State: The "Australia Card" Style */}
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-blue-600">
                      Study in {dest.name}
                    </h3>
                    <div className="w-12 h-1 bg-orange-500 rounded-full" />{" "}
                    {/* Accent line like the image */}
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base line-clamp-6">
                      {dest.heroSubtitle ||
                        `Uncover a world of opportunities in ${dest.name}. With world-class institutions and an outstanding quality of life, your academic journey starts here.`}
                    </p>
                  </div>

                  {/* Enhanced Discover Button */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-blue-600 text-white rounded-full font-semibold group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                      Discover
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </CountryAwareLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
