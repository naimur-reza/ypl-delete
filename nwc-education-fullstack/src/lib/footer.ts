import { prisma } from "@/lib/prisma";
import type { FooterSettings, QuickLink } from "@/schemas/settings";

// Static fallback data matching current footer
const staticFallback: FooterSettings = {
  footerDestinations: null, // Will be handled separately
  contactPhone: "+44 (0)203 488 1195",
  contactEmail: "info@nwceducation.com",
  contactAddress: "Unit 1, Sky View Tower,\nLondon E15 2GR, UK",
  quickLinks: [
    { label: "About Us", url: "/about-us" },
    { label: "Our Services", url: "/services" },
    { label: "University Partners", url: "/universities" },
    { label: "Student Testimonials", url: "/testimonials" },
    { label: "Events & Fairs", url: "/events" },
    { label: "Contact Us", url: "/contact-us" },
  ],
  socialFacebook: "#",
  socialYoutube: "#",
  socialLinkedin: "#",
  socialTwitter: null,
  socialInstagram: null,
  privacyPolicyUrl: "#",
  termsOfServiceUrl: "#",
  cookiePolicyUrl: "#",
  footerDescription:
    "Empowering students to achieve their global education dreams through expert guidance and personalized support.",
};

// Static destination names (fallback when no destinations are selected)
const staticDestinations = [
  "United Kingdom",
  "USA",
  "Canada",
  "Australia",
  "New Zealand",
  "Ireland",
];

/**
 * Fetch footer settings with fallback to static defaults
 */
export async function fetchFooterSettings(): Promise<FooterSettings> {
  try {
    const settings = await prisma.settings.findUnique({
      where: { key: "footer" },
    });

    if (!settings) {
      return staticFallback;
    }

    // Merge with static fallback to ensure all fields are present
    return {
      footerDestinations: settings.footerDestinations as
        | string[]
        | null
        | undefined,
      contactPhone: settings.contactPhone || staticFallback.contactPhone,
      contactEmail: settings.contactEmail || staticFallback.contactEmail,
      contactAddress: settings.contactAddress || staticFallback.contactAddress,
      quickLinks:
        (settings.quickLinks as QuickLink[] | null | undefined) ||
        staticFallback.quickLinks,
      socialFacebook: settings.socialFacebook || staticFallback.socialFacebook,
      socialYoutube: settings.socialYoutube || staticFallback.socialYoutube,
      socialLinkedin: settings.socialLinkedin || staticFallback.socialLinkedin,
      socialTwitter: settings.socialTwitter || staticFallback.socialTwitter,
      socialInstagram:
        settings.socialInstagram || staticFallback.socialInstagram,
      privacyPolicyUrl:
        settings.privacyPolicyUrl || staticFallback.privacyPolicyUrl,
      termsOfServiceUrl:
        settings.termsOfServiceUrl || staticFallback.termsOfServiceUrl,
      cookiePolicyUrl:
        settings.cookiePolicyUrl || staticFallback.cookiePolicyUrl,
      footerDescription:
        settings.footerDescription || staticFallback.footerDescription,
    };
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    return staticFallback;
  }
}

/**
 * Fetch selected destinations for footer
 */
export async function getFooterDestinations() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { key: "footer" },
    });

    const destinationIds = settings?.footerDestinations as
      | string[]
      | null
      | undefined;

    if (!destinationIds || destinationIds.length === 0) {
      // Return static destination names if no destinations selected
      return staticDestinations.map((name) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        id: null,
      }));
    }

    // Fetch destinations from database
    const destinations = await prisma.destination.findMany({
      where: {
        id: { in: destinationIds },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Return in the order specified by destinationIds array
    return destinationIds
      .map((id) => destinations.find((d) => d.id === id))
      .filter((d): d is NonNullable<typeof d> => d !== undefined)
      .map((d) => ({
        name: d.name,
        slug: d.slug,
        id: d.id,
      }));
  } catch (error) {
    console.error("Error fetching footer destinations:", error);
    return staticDestinations.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      id: null,
    }));
  }
}

/**
 * Parse and return quick links array
 */
export function getFooterQuickLinks(
  quickLinks: QuickLink[] | null | undefined
): QuickLink[] {
  if (!quickLinks || !Array.isArray(quickLinks)) {
    return staticFallback.quickLinks || [];
  }
  return quickLinks;
}

/**
 * Return structured social media links
 */
export interface SocialLinks {
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export function getSocialLinks(settings: FooterSettings): SocialLinks {
  return {
    facebook: settings.socialFacebook || undefined,
    youtube: settings.socialYoutube || undefined,
    linkedin: settings.socialLinkedin || undefined,
    twitter: settings.socialTwitter || undefined,
    instagram: settings.socialInstagram || undefined,
  };
}

/**
 * Fetch global offices for footer display
 */
export async function getFooterGlobalOffices(countrySlug: string | undefined) {
  console.log("Fetching global offices for countrySlug:", countrySlug);
  try {
    const offices = await prisma.globalOffice.findMany({
      where: {
        status: "ACTIVE",
        countries: {
          some: {
            country: {
              slug: countrySlug,
            },
          },
        },
      },
      include: {
        countries: {
          include: {
            country: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return offices.map((office) => ({
      id: office.id,
      name: office.name,
      slug: office.slug,
      countries: office.countries.map((oc) => oc.country.slug),
    }));
  } catch (error) {
    console.error("Error fetching global offices:", error);
    return [];
  }
}
