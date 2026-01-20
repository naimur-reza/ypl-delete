import { prisma } from "@/lib/prisma";
import { EssentialStudySectionClient } from "./essential-study-section-client";

interface EssentialStudySectionProps {
  countryName: string;
  countryCode: string;
  destinationSlug: string;
}

export async function EssentialStudySection({
  countryName,
  countryCode,
  destinationSlug,
}: EssentialStudySectionProps) {
  // Fetch essential study items for the country (destination)
  // We can use destinationSlug directly now.

  const destination = await prisma.destination.findUnique({
    where: { slug: destinationSlug },
    include: {
      essentialStudies: true,
    },
  });

  const essentials = destination?.essentialStudies || [];

  // Fallback data if DB is empty for demonstration
  const displayEssentials =
    essentials.length > 0
      ? essentials
      : [
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
        ];

  return (
    <EssentialStudySectionClient
      essentials={displayEssentials}
      countryName={countryName}
      destinationSlug={destinationSlug}
    />
  );
}
