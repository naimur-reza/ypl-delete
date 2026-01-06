import CountrySectionContent from "./country-section-content";
import { Destination } from "../../../../../../prisma/src/generated/prisma/browser";

export async function CountriesSection({
  destination,
}: {
  destination: Pick<Destination, "name" | "id" | "slug" | "thumbnail">[];
}) {
  return (
    <section className="relative py-14 px-4 md:px-8 overflow-hidden bg-gray-500">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-6xl  font-serif font-bold text-white mb-16 leading-tight tracking-tight">
          Start your journey with the right destination — and the right advice
        </h2>
        <CountrySectionContent countries={destination.slice(0, 5)} />
      </div>
    </section>
  );
}
