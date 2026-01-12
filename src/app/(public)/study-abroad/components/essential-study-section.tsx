import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { GradientButton } from "@/components/ui/gradient-button";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

interface EssentialStudySectionProps {
  countryName: string;
  countryCode: string;
  destinationSlug: string;
}

export async function EssentialStudySection({ countryName, countryCode, destinationSlug }: EssentialStudySectionProps) {
  // Fetch essential study items for the country (destination)
  // We can use destinationSlug directly now.
  
  const destination = await prisma.destination.findUnique({
    where: { slug: destinationSlug },
    include: {
      essentialStudies: true
    }
  });

  const essentials = destination?.essentialStudies || [];

  // Fallback data if DB is empty for demonstration
  const displayEssentials = essentials.length > 0 ? essentials : [
    {
      id: "1",
      title: `Applying to Study at a ${countryName} University`,
      description: `Learn how to apply to universities in ${countryName} with our step-by-step guide. Find the application process, requirements, and admission tips for international students.`,
      slug: "applying-to-study",
    },
    {
      id: "2",
      title: `Understanding the ${countryName} University System`,
      description: `Explore ${countryName}'s education system. Insights on Grading, credits, and study levels of universities and colleges.`,
      slug: "university-system",
    },
    {
      id: "3",
      title: `${countryName} Study Intakes`,
      description: `Learn more about the different university intakes in ${countryName} for international students and begin your application today.`,
      slug: "study-intakes",
    },
    {
      id: "4",
      title: `${countryName} University Rankings 2026`,
      description: `Explore ${countryName} university rankings 2026 and find the best institutions. Top-ranking universities in ${countryName} for international students.`,
      slug: "university-rankings",
    },
    {
      id: "5",
      title: `Cost of Studying in ${countryName}`,
      description: `Explore ${countryName} university course fees and study costs. Get insights into the cost of living and other financial aspects of studying in ${countryName}.`,
      slug: "cost-of-studying",
    },
    {
      id: "6",
      title: `${countryName} Student Visa`,
      description: `${countryName} student visa requirements and types for international students. Essential information for your student visa in ${countryName}.`,
      slug: "student-visa",
    },
  ];

  return (
    <section className="py-14 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-8 font-serif">
            Essential study information <br />
            for your journey abroad
          </h2>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Enter keywords"
              className="w-full pl-6 pr-16 py-4 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-slate-600"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md px-4 flex items-center justify-center transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Items */}
        <div className="space-y-0 divide-y divide-slate-200 border-t border-b border-slate-200">
          {displayEssentials.map((item) => (
            <div key={item.id} className="py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-bold text-secondary mb-3 font-serif group-hover:text-secondary/80 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>
              <div className="shrink-0">
                <CountryAwareLink
                  href={`/study-abroad/${destinationSlug}/${item.slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg min-w-[140px]"
                >
                  Learn more
                </CountryAwareLink>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <GradientButton className="px-8 py-3">
            Load More &gt;
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
