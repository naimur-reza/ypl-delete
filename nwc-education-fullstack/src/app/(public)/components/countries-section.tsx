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
    <section className="relative py-14 px-4 md:px-8 overflow-hidden bg-gray-500">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-6xl  font-serif font-bold text-white mb-16 leading-tight tracking-tight">
          Start your journey with the right destination — and the right advice
        </h2>
        <CountrySectionContent countries={countries} />
      </div>
    </section>
  );
}
