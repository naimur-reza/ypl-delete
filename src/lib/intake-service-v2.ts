import { prisma } from "@/lib/prisma";
import { IntakeMonth } from "@/hooks/use-course-wizard";

// Types for intake page data
export interface IntakePageData {
  id: string;
  title: string;
  description?: string;

  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;
  heroMedia?: string;
  heroCTALabel?: string;
  heroCTAUrl?: string;

  // Why Choose Section
  whyChooseTitle?: string;
  whyChooseDescription?: string;
  benefits?: Array<{
    id: string;
    title: string;
    description?: string;
    icon?: string;
    sortOrder: number;
  }>;

  // Eligibility
  // Application Timeline & Countdown
  timelineJson?: any;
  targetDate?: Date | null;
  timelineEnabled?: boolean;

  // How We Help
  howWeHelpJson?: any;
  howWeHelpEnabled?: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Relations
  destination: {
    id: string;
    name: string;
    slug: string;
    thumbnail?: string;
  };
  intake: IntakeMonth;
  status: string;
}

export interface IntakePageQuery {
  destinationSlug: string;
  intake: IntakeMonth;
  countrySlug?: string; // undefined = global
}

/**
 * Unified service to fetch intake page data
 * Handles both country-specific and global intake pages
 */
export class IntakeService {
  /**
   * Fetch intake page data based on query parameters
   * For now, works with existing schema (country-agnostic)
   */
  static async getIntakePage(
    query: IntakePageQuery,
  ): Promise<IntakePageData | null> {
    const { destinationSlug, intake } = query;

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

    // Find intake page (existing schema is country-agnostic)
    const intakePage = await prisma.intakePage.findFirst({
      where: {
        destinationId: destination.id,
        intake,
        status: "ACTIVE",
      },
      include: {
        intakePageBenefits: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!intakePage) {
      return null;
    }

    // Transform data to expected format
    return {
      id: intakePage.id,
      title: intakePage.title,
      description: intakePage.description || undefined,

      // Hero Section
      heroTitle: intakePage.heroTitle || undefined,
      heroSubtitle: intakePage.heroSubtitle || undefined,
      heroMedia: intakePage.heroMedia || undefined,
      heroCTALabel: intakePage.heroCTALabel || undefined,
      heroCTAUrl: intakePage.heroCTAUrl || undefined,

      // Why Choose Section
      whyChooseTitle: intakePage.whyChooseTitle || undefined,
      whyChooseDescription: intakePage.whyChooseDescription || undefined,
      benefits: intakePage.intakePageBenefits
        .filter((benefit) => benefit.isActive !== false)
        .map((benefit) => ({
          id: benefit.id,
          title: benefit.title,
          description: benefit.description || undefined,
          icon: benefit.icon || undefined,
          sortOrder: benefit.sortOrder,
        })),

      // Timeline & Countdown
      timelineJson: intakePage.timelineJson || undefined,
      targetDate: intakePage.targetDate || null,
      timelineEnabled: intakePage.timelineEnabled,

      // How We Help
      howWeHelpJson: intakePage.howWeHelpJson || undefined,
      howWeHelpEnabled: intakePage.howWeHelpEnabled,

      // SEO
      metaTitle: intakePage.metaTitle || undefined,
      metaDescription: intakePage.metaDescription || undefined,
      metaKeywords: intakePage.metaKeywords || undefined,

      // Relations
      destination: {
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        thumbnail: destination.thumbnail || undefined,
      },
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
      description: page.description || undefined,
    }));
  }

  /**
   * Get universities for a destination (used by Top Universities section)
   */
  static async getTopUniversities(
    destinationSlug: string,
    options?: { countrySlug?: string; limit?: number },
  ): Promise<{
    items: Array<{
      id: string;
      name: string;
      slug: string;
      logo?: string;
      thumbnail?: string;
      address?: string;
      rankingNumber?: number | null;
      isFeatured?: boolean;
    }>;
    total: number;
  }> {
    const destination = await prisma.destination.findUnique({
      where: { slug: destinationSlug },
      select: { id: true },
    });

    if (!destination) {
      return { items: [], total: 0 };
    }

    const limit = options?.limit ?? 200;
    const countryFilter = options?.countrySlug
      ? {
          some: {
            country: { slug: options.countrySlug },
          },
        }
      : undefined;

    const universities = await prisma.university.findMany({
      where: {
        destinationId: destination.id,
        status: "ACTIVE",
        countries: countryFilter,
      },
      orderBy: [
        { isFeatured: "desc" },
        { rankingNumber: "asc" },
        { name: "asc" },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        thumbnail: true,
        address: true,
        rankingNumber: true,
        isFeatured: true,
      },
    });

    return {
      items: universities.map((uni) => ({
        id: uni.id,
        name: uni.name,
        slug: uni.slug,
        logo: uni.logo || undefined,
        thumbnail: uni.thumbnail || undefined,
        address: uni.address || undefined,
        rankingNumber: uni.rankingNumber,
        isFeatured: uni.isFeatured,
      })),
      total: universities.length,
    };
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
