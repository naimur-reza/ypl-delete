import { prisma } from "./prisma";
import { IntakeMonth } from "../../prisma/src/generated/prisma/client";

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FAQContext = {
  eventId?: string;
  courseId?: string;
  scholarshipId?: string;
  universityId?: string;
  destinationId?: string;
  intakePage?: {
    destinationId: string;
    intake: IntakeMonth;
  };
};

/**
 * Fetch FAQs filtered by country slug
 * Returns only FAQs linked to the specific country (per-country only, no global fallback)
 */
export async function fetchFaqsByCountrySlug(
  countrySlug: string | null | undefined,
  limit: number = 6,
): Promise<FAQItem[]> {
  return prisma.fAQ.findMany({
    where: countrySlug
      ? {
          countries: {
            some: {
              country: {
                slug: countrySlug,
              },
            },
          },
        }
      : {}, // Empty where clause returns no FAQs if no country slug
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs by event ID
 */
export async function fetchFaqsByEventId(
  eventId: string,
  limit: number = 6,
): Promise<FAQItem[]> {
  return prisma.fAQ.findMany({
    where: {
      status: "ACTIVE",
      events: {
        some: {
          eventId,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs by course ID
 */
export async function fetchFaqsByCourseId(
  courseId: string,
  limit: number = 6,
): Promise<FAQItem[]> {
  return prisma.fAQ.findMany({
    where: {
      status: "ACTIVE",
      courses: {
        some: {
          courseId,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs by scholarship ID
 */
export async function fetchFaqsByScholarshipId(
  scholarshipId: string,
  limit: number = 6,
): Promise<FAQItem[]> {
  return prisma.fAQ.findMany({
    where: {
      status: "ACTIVE",
      scholarships: {
        some: {
          scholarshipId,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs by intake page (destination + intake month)
 */

/**
 * Fetch FAQs for home page (global + country-specific)
 */
export async function fetchFaqsForHomePage(
  countrySlug?: string | null,
  limit: number = 6,
): Promise<FAQItem[]> {
  const whereConditions: any[] = [
    {
      isGlobal: true,
    },
  ];

  if (countrySlug) {
    whereConditions.push({
      countries: {
        some: {
          country: {
            slug: countrySlug,
          },
        },
      },
    });
  }

  return prisma.fAQ.findMany({
    where: {
      status: "ACTIVE",
      OR: whereConditions,
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Unified context-based FAQ fetcher with fallback logic
 */
export async function fetchFaqsByContext(
  context: FAQContext,
  limit: number = 6,
): Promise<FAQItem[]> {
  let faqs: FAQItem[] = [];

  // Try to fetch FAQs by specific context first
  if (context.eventId) {
    faqs = await fetchFaqsByEventId(context.eventId, limit);
    // If no event-specific FAQs, fallback to destination FAQs
    if (faqs.length === 0 && context.destinationId) {
      faqs = await prisma.fAQ.findMany({
        where: {
          status: "ACTIVE",
          destinations: {
            some: {
              destinationId: context.destinationId,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
        select: {
          id: true,
          question: true,
          answer: true,
        },
      });
    }
  } else if (context.courseId) {
    faqs = await fetchFaqsByCourseId(context.courseId, limit);
    // Fallback to university or destination FAQs
    if (faqs.length === 0) {
      const course = await prisma.course.findUnique({
        where: { id: context.courseId },
        select: { universityId: true, destinationId: true },
      });

      if (course?.universityId) {
        faqs = await prisma.fAQ.findMany({
          where: {
            status: "ACTIVE",
            universities: {
              some: {
                universityId: course.universityId,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: {
            id: true,
            question: true,
            answer: true,
          },
        });
      }

      if (faqs.length === 0 && course?.destinationId) {
        faqs = await prisma.fAQ.findMany({
          where: {
            status: "ACTIVE",
            destinations: {
              some: {
                destinationId: course.destinationId,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: {
            id: true,
            question: true,
            answer: true,
          },
        });
      }
    }
  } else if (context.scholarshipId) {
    faqs = await fetchFaqsByScholarshipId(context.scholarshipId, limit);
    // Fallback to destination/university FAQs
    if (faqs.length === 0) {
      const scholarship = await prisma.scholarship.findUnique({
        where: { id: context.scholarshipId },
        select: { destinationId: true, universityId: true },
      });

      if (scholarship?.universityId) {
        faqs = await prisma.fAQ.findMany({
          where: {
            status: "ACTIVE",
            universities: {
              some: {
                universityId: scholarship.universityId,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: {
            id: true,
            question: true,
            answer: true,
          },
        });
      }

      if (faqs.length === 0 && scholarship?.destinationId) {
        faqs = await prisma.fAQ.findMany({
          where: {
            status: "ACTIVE",
            destinations: {
              some: {
                destinationId: scholarship.destinationId,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: {
            id: true,
            question: true,
            answer: true,
          },
        });
      }
    }
  } else if (context.universityId) {
    faqs = await prisma.fAQ.findMany({
      where: {
        status: "ACTIVE",
        universities: {
          some: {
            universityId: context.universityId,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });
  } else if (context.destinationId) {
    faqs = await prisma.fAQ.findMany({
      where: {
        status: "ACTIVE",
        destinations: {
          some: {
            destinationId: context.destinationId,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });
  } else if (context.intakePage) {
  }

  return faqs;
}

/**
 * Fetch FAQs for scholarships listing page
 * Uses showOnScholarshipsMainPage flag
 */
export async function fetchFaqsForScholarshipsPage(
  countrySlug?: string | null,
  limit: number = 6,
): Promise<FAQItem[]> {
  const where: any = {
    status: "ACTIVE",
    showOnScholarshipsMainPage: true,
  };

  // Filter by country if provided
  if (countrySlug) {
    where.OR = [
      {
        isGlobal: true,
      },
      {
        countries: {
          some: {
            country: {
              slug: countrySlug,
            },
          },
        },
      },
    ];
  } else {
    where.isGlobal = true;
  }

  return prisma.fAQ.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs for universities listing page
 * Uses showOnUniversitiesMainPage flag
 */
export async function fetchFaqsForUniversitiesPage(
  countrySlug?: string | null,
  limit: number = 6,
): Promise<FAQItem[]> {
  const where: any = {
    status: "ACTIVE",
    showOnUniversitiesMainPage: true,
  };

  if (countrySlug) {
    where.OR = [
      {
        isGlobal: true,
      },
      {
        countries: {
          some: {
            country: {
              slug: countrySlug,
            },
          },
        },
      },
    ];
  } else {
    where.isGlobal = true;
  }

  return prisma.fAQ.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs for events listing page
 * Uses showOnEventsMainPage flag
 */
export async function fetchFaqsForEventsPage(
  countrySlug?: string | null,
  limit: number = 6,
): Promise<FAQItem[]> {
  const where: any = {
    status: "ACTIVE",
    showOnEventsMainPage: true,
  };

  if (countrySlug) {
    where.OR = [
      {
        isGlobal: true,
      },
      {
        countries: {
          some: {
            country: {
              slug: countrySlug,
            },
          },
        },
      },
    ];
  } else {
    where.isGlobal = true;
  }

  return prisma.fAQ.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs for courses listing page
 * Uses showOnCoursesMainPage flag
 */
export async function fetchFaqsForCoursesPage(
  countrySlug?: string | null,
  limit: number = 6,
): Promise<FAQItem[]> {
  const where: any = {
    status: "ACTIVE",
    showOnCoursesMainPage: true,
  };

  if (countrySlug) {
    where.OR = [
      {
        isGlobal: true,
      },
      {
        countries: {
          some: {
            country: {
              slug: countrySlug,
            },
          },
        },
      },
    ];
  } else {
    where.isGlobal = true;
  }

  return prisma.fAQ.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs for destinations listing page
 * Uses showOnDestinationsMainPage flag
 */
export async function fetchFaqsForDestinationsPage(
  countrySlug?: string | null,
  limit: number = 6,
): Promise<FAQItem[]> {
  const where: any = {
    status: "ACTIVE",
    showOnDestinationsMainPage: true,
  };

  if (countrySlug) {
    where.OR = [
      {
        isGlobal: true,
      },
      {
        countries: {
          some: {
            country: {
              slug: countrySlug,
            },
          },
        },
      },
    ];
  } else {
    where.isGlobal = true;
  }

  return prisma.fAQ.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}

/**
 * Fetch FAQs for main listing pages (Universities, Scholarships, Study Abroad, etc.)
 * Uses entity-specific showOnMainPage flags to filter FAQs
 */
export async function fetchFaqsForMainPage(
  countrySlug?: string | null,
  entityType?:
    | "universities"
    | "scholarships"
    | "destinations"
    | "events"
    | "courses",
  limit: number = 6,
): Promise<FAQItem[]> {
  let where: any = {
    status: "ACTIVE",
  };

  // Add country filter if provided
  if (countrySlug) {
    where.OR = [
      {
        isGlobal: true,
      },
      {
        countries: {
          some: {
            country: {
              slug: countrySlug,
            },
          },
        },
      },
    ];
  } else {
    where.isGlobal = true;
  }

  // Filter by entity-specific showOnMainPage flag
  if (entityType === "universities") {
    where.showOnUniversitiesMainPage = true;
  } else if (entityType === "scholarships") {
    where.showOnScholarshipsMainPage = true;
  } else if (entityType === "destinations") {
    where.showOnDestinationsMainPage = true;
  } else if (entityType === "events") {
    where.showOnEventsMainPage = true;
  } else if (entityType === "courses") {
    where.showOnCoursesMainPage = true;
  }

  const faqs = await prisma.fAQ.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });

  return faqs;
}
