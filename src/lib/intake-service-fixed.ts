import { prisma } from "@/lib/prisma";
import { IntakeMonth } from "@/hooks/use-course-wizard";
import {
  IntakePageData,
  IntakePageQuery,
  IntakePageBenefit,
} from "@/types/intake";

/**
 * Unified service to fetch intake page data
 * Handles both country-specific and global intake pages
 */
export class IntakeService {
  /**
   * Fetch intake page data based on query parameters
   * Priority: Country-specific > Global
   */
  static async getIntakePage(
    query: IntakePageQuery,
  ): Promise<IntakePageData | null> {
    const { destinationSlug, intake, countrySlug } = query;

    // First, get the destination
    const destination = await prisma.destination.findUnique({
      where: { slug: destinationSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnail: true,
      },
    });

    if (!destination) {
      return null;
    }

    // Try to find country-specific intake page first
    let intakePage = null;
    let country = null;

    if (countrySlug) {
      country = await prisma.country.findUnique({
        where: { slug: countrySlug },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      if (country) {
        intakePage = await prisma.intakePage.findFirst({
          where: {
            destinationId: destination.id,
            intake,
            countryId: country.id,
            isGlobal: false,
            status: "ACTIVE",
          },
          include: {
            intakePageBenefits: {
              orderBy: { sortOrder: "asc" },
            },
            country: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });
      }
    }

    // If no country-specific page found, try global page
    if (!intakePage) {
      intakePage = await prisma.intakePage.findFirst({
        where: {
          destinationId: destination.id,
          intake,
          isGlobal: true,
          status: "ACTIVE",
        },
        include: {
          intakePageBenefits: {
            orderBy: { sortOrder: "asc" },
          },
          country: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    }

    if (!intakePage) {
      return null;
    }

    // Transform data to expected format
    return {
      id: intakePage.id,
      title: intakePage.title,
      slug: intakePage.slug || "",
      description: intakePage.description || "",

      // Hero Section
      heroTitle: intakePage.heroTitle || "",
      heroSubtitle: intakePage.heroSubtitle || "",
      heroMedia: intakePage.heroMedia || "",
      heroCTALabel: intakePage.heroCTALabel || "",
      heroCTAUrl: intakePage.heroCTAUrl || "",

      // Why Choose Section
      whyChooseTitle: intakePage.whyChooseTitle || "",
      whyChooseDescription: intakePage.whyChooseDescription || "",
      //   benefits: intakePage.intakePageBenefits.map(
      //     (benefit): IntakePageBenefit => ({
      //       id: benefit.id,
      //       title: benefit.title,
      //       description: benefit.description || "",
      //       icon: benefit.icon || "",
      //       sortOrder: benefit.sortOrder,
      //     }),
      //   ),

      // Timeline
      timelineJson: intakePage.timelineJson || "",
      targetDate: intakePage.targetDate || null,
      timelineEnabled: intakePage.timelineEnabled || true,

      // How We Help
      howWeHelpJson: intakePage.howWeHelpJson || "",
      howWeHelpEnabled: intakePage.howWeHelpEnabled || true,

      // SEO
      metaTitle: intakePage.metaTitle || "",
      metaDescription: intakePage.metaDescription || "",
      metaKeywords: intakePage.metaKeywords || "",
      canonicalUrl: intakePage.canonicalUrl || "",

      // Relations
      destination: {
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        thumbnail: destination.thumbnail || undefined,
      },
      country: intakePage.country,
      isGlobal: intakePage.isGlobal || false,
      intake: intakePage.intake,
      status: intakePage.status,
    };
  }

  /**
   * Get all available intake pages for a destination
   */
  static async getAvailableIntakes(destinationSlug: string): Promise<
    Array<{
      intake: IntakeMonth;
      title: string;
      description?: string;
    }>
  > {
    const destination = await prisma.destination.findUnique({
      where: { slug: destinationSlug },
      select: { id: true },
    });

    if (!destination) {
      return [];
    }

    const intakePages = await prisma.intakePage.findMany({
      where: {
        destinationId: destination.id,
        status: "ACTIVE",
      },
      select: {
        intake: true,
        title: true,
        description: true,
      },
      orderBy: { intake: "asc" },
    });

    return intakePages.map((page) => ({
      intake: page.intake,
      title: page.title,
      description: page.description || "",
    }));
  }

  /**
   * Get universities for a destination (used by Top Universities section)
   */
  static async getTopUniversities(
    destinationSlug: string,
    limit: number = 6,
  ): Promise<
    Array<{
      id: string;
      name: string;
      slug: string;
      logo?: string;
      thumbnail?: string;
      address?: string;
    }>
  > {
    const destination = await prisma.destination.findUnique({
      where: { slug: destinationSlug },
      select: { id: true },
    });

    if (!destination) {
      return [];
    }

    const universities = await prisma.university.findMany({
      where: {
        destinationId: destination.id,
        status: "ACTIVE",
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        thumbnail: true,
        address: true,
      },
    });

    return universities.map((uni) => ({
      id: uni.id,
      name: uni.name,
      slug: uni.slug,
      logo: uni.logo || "",
      thumbnail: uni.thumbnail || "",
      address: uni.address || "",
    }));
  }

  /**
   * Get FAQs for an intake page
   */
  static async getIntakeFAQs(
    intakePageId: string,
    limit: number = 10,
  ): Promise<
    Array<{
      id: string;
      question: string;
      answer: string;
    }>
  > {
    const faqLinks = await prisma.fAQIntakePage.findMany({
      where: { intakePageId },
      include: {
        faq: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
      take: limit,
    });

    return faqLinks.map((link) => link.faq);
  }
}
