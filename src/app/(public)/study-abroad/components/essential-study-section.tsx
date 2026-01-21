import { prisma } from "@/lib/prisma";
import { EssentialStudyClient } from "./essential-study-client";

interface EssentialStudySectionProps {
  countryName: string;
  countryCode: string;
  destinationSlug: string;
}

export async function EssentialStudySection({ countryName, countryCode, destinationSlug }: EssentialStudySectionProps) {
  // Fetch essential study items that are either:
  // 1. Associated with the current country (via EssentialStudyCountry junction), OR
  // 2. Global (isGlobal = true)
  
  // First, get the country ID from the country code/slug
  const country = countryCode ? await prisma.country.findFirst({
    where: { 
      OR: [
        { slug: countryCode },
        { isoCode: countryCode.toUpperCase() }
      ]
    },
    select: { id: true }
  }) : null;

  // Also get destination for fallback
  const destination = await prisma.destination.findUnique({
    where: { slug: destinationSlug },
    select: { id: true }
  });

  // Build the where clause based on available data
  const whereConditions: any[] = [];

  // Add country-specific filter if we have a country
  if (country?.id) {
    whereConditions.push({
      countries: {
        some: {
          countryId: country.id
        }
      }
    });
  }

  // Add destination-specific filter
  if (destination?.id) {
    whereConditions.push({
      destinationId: destination.id,
      // Also ensure it's not country-restricted OR has no countries (direct destination link)
      OR: [
        { countries: { none: {} } },
        { isGlobal: true }
      ]
    });
  }

  // Always include global essentials
  whereConditions.push({
    isGlobal: true
  });

  // Fetch essentials with proper filtering
  const essentials = await prisma.essentialStudy.findMany({
    where: {
      status: "ACTIVE",
      OR: whereConditions,
    },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      isGlobal: true,
    },
    orderBy: [
      { isGlobal: 'desc' }, // Show global ones first
      { createdAt: 'desc' }
    ]
  });

  // Deduplicate essentials in case of overlap
  const uniqueEssentials = essentials.reduce((acc, item) => {
    if (!acc.find(e => e.id === item.id)) {
      acc.push(item);
    }
    return acc;
  }, [] as typeof essentials);

  return (
    <EssentialStudyClient 
      essentials={uniqueEssentials}
      destinationSlug={destinationSlug}
      countryName={countryName}
    />
  );
}
