import CountrySectionContent from "@/app/[country]/(public)/(home)/components/country-section-content";
import { prisma } from "@/lib/prisma";

export async function CountriesSection() {
  const countries = await prisma.destination.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      thumbnail: true,
    },
    take: 5,
  });

  return (
    <section className="relative py-8 sm:py-12 md:py-14 px-4 sm:px-6 md:px-8 overflow-hidden bg-gray-500">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white mb-8 sm:mb-12 md:mb-16 leading-tight tracking-tight">
          Start your journey with the right destination — and the right advice
        </h2>
        <CountrySectionContent countries={countries} />
      </div>
    </section>
  );
}
