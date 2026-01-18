import { cache } from "react";
import { prisma } from "./prisma";
import { getCountryBySlug } from "./countries";

type CountrySource = "param" | "geo" | "global";

export type ResolvedCountry = {
  slug: string | null;
  name: string | null;
  isoCode: string | null;
  source: CountrySource;
};

const GEO_IP_ENDPOINT = "https://ipapi.co";

// Remove this function - can't use headers() in build time
// const getClientIp = (): string | null => {
//   const headerList = headers();
//   ...
// };

const lookupCountryByIso = async (
  isoCode: string | null | undefined
): Promise<ResolvedCountry | null> => {
  if (!isoCode) return null;
  const normalized = isoCode.toUpperCase();

  const match = await prisma.country.findFirst({
    where: { isoCode: normalized, status: "ACTIVE" },
    select: { slug: true, name: true, isoCode: true },
  });

  if (!match) return null;

  return {
    slug: match.slug,
    name: match.name,
    isoCode: match.isoCode,
    source: "geo",
  };
};

// Updated: Remove IP detection, use Vercel geo headers instead
const resolveFromGeoIp = async (): Promise<ResolvedCountry | null> => {
  try {
    // On Vercel, country is available via request headers (set by middleware)
    // For now, we'll skip geo detection in server components
    // This will be handled by middleware instead
    return null;
  } catch (error) {
    console.error("Geo IP lookup error", error);
    return null;
  }
};

// Cache this function
export const resolveCountryContext = cache(
  async (paramSlug?: string | null): Promise<ResolvedCountry> => {
    // 1. If param provided, use it
    if (paramSlug) {
      const country = await getCountryBySlug(paramSlug);
      if (country) {
        return {
          slug: country.slug,
          name: country.name,
          isoCode: country.isoCode,
          source: "param",
        };
      }
    }

    // 2. Otherwise, return global (middleware handles geo detection)
    return {
      slug: null,
      name: null,
      isoCode: null,
      source: "global",
    };
  }
);
