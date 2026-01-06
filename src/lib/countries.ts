import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Country information type
 */
export type CountryInfo = {
  id: string;
  name: string;
  slug: string;
  flag: string | null;
  isoCode: string;
};

/**
 * Fetch all active countries from database
 * Cached to avoid repeated database queries
 */
export const getActiveCountries = cache(async (): Promise<CountryInfo[]> => {
  try {
    const countries = await prisma.country.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        flag: true,
        isoCode: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return countries;
  } catch (error) {
    console.error("Error fetching active countries:", error);
    return [];
  }
});

/**
 * Get a single country by slug
 * Cached for performance
 */
export const getCountryBySlug = cache(
  async (slug: string): Promise<CountryInfo | null> => {
    try {
      const country = await prisma.country.findUnique({
        where: {
          slug,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          flag: true,
          isoCode: true,
        },
      });

      return country;
    } catch (error) {
      console.error(`Error fetching country with slug ${slug}:`, error);
      return null;
    }
  }
);

/**
 * Validate if a slug is a valid active country
 * Cached for performance
 */
export const isValidCountry = cache(async (slug: string): Promise<boolean> => {
  try {
    const count = await prisma.country.count({
      where: {
        slug,
        isActive: true,
      },
    });

    return count > 0;
  } catch (error) {
    console.error(`Error validating country slug ${slug}:`, error);
    return false;
  }
});

/**
 * Get all country slugs for static generation
 * Cached for performance
 */
export const getCountrySlugs = cache(async (): Promise<string[]> => {
  try {
    const countries = await prisma.country.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
      },
    });

    return countries.map((c) => c.slug);
  } catch (error) {
    console.error("Error fetching country slugs:", error);
    return [];
  }
});
