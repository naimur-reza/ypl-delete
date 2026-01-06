import { prisma } from "./prisma";
import { IntakeMonth } from "@prisma/client";

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
  limit: number = 6
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
  limit: number = 6
): Promise<FAQItem[]> {
  return prisma.fAQ.findMany({
    where: {
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
  limit: number = 6
): Promise<FAQItem[]> {
  return prisma.fAQ.findMany({
    where: {
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
  limit: number = 6
): Promise<FAQItem[]> {
  return prisma.fAQ.findMany({
    where: {
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
export async function fetchFaqsByIntakePage(
  destinationId: string,
  intake: IntakeMonth,
  limit: number = 6
): Promise<FAQItem[]> {
  // First find the intake page
  const intakePage = await prisma.intakePage.findUnique({
    where: {
      destinationId_intake: {
        destinationId,
        intake,
      },
    },
  });

  if (!intakePage) {
    return [];
  }

  return prisma.fAQ.findMany({
    where: {
      intakePages: {
        some: {
          intakePageId: intakePage.id,
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
 * Fetch FAQs for home page (global + country-specific)
 */
export async function fetchFaqsForHomePage(
  countrySlug?: string | null,
  limit: number = 6
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
  limit: number = 6
): Promise<FAQItem[]> {
  let faqs: FAQItem[] = [];

  // Try to fetch FAQs by specific context first
  if (context.eventId) {
    faqs = await fetchFaqsByEventId(context.eventId, limit);
    // If no event-specific FAQs, fallback to destination FAQs
    if (faqs.length === 0 && context.destinationId) {
      faqs = await prisma.fAQ.findMany({
        where: {
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
    faqs = await fetchFaqsByIntakePage(
      context.intakePage.destinationId,
      context.intakePage.intake,
      limit
    );
  }

  return faqs;
}

/**
 * Fetch FAQs for scholarships listing page
 * Returns FAQs linked to 2+ scholarships (indicates general relevance)
 */
export async function fetchFaqsForScholarshipsPage(
  countrySlug?: string | null,
  limit: number = 6
): Promise<FAQItem[]> {
  const where: any = {
    scholarships: {
      some: {},
    },
  };

  // Filter by country if provided
  if (countrySlug) {
    where.countries = {
      some: {
        country: {
          slug: countrySlug,
        },
      },
    };
  }

  // Get all FAQs with scholarships, then filter those with 2+
  const allFaqs = await prisma.fAQ.findMany({
    where,
    include: {
      scholarships: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Filter FAQs that have 2+ scholarships
  const filteredFaqs = allFaqs.filter((faq) => faq.scholarships.length >= 2);

  return filteredFaqs.slice(0, limit).map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));
}

/**
 * Fetch FAQs for universities listing page
 * Returns FAQs linked to 2+ universities
 */
export async function fetchFaqsForUniversitiesPage(
  countrySlug?: string | null,
  limit: number = 6
): Promise<FAQItem[]> {
  const where: any = {
    universities: {
      some: {},
    },
  };

  if (countrySlug) {
    where.countries = {
      some: {
        country: {
          slug: countrySlug,
        },
      },
    };
  }

  const allFaqs = await prisma.fAQ.findMany({
    where,
    include: {
      universities: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const filteredFaqs = allFaqs.filter((faq) => faq.universities.length >= 2);

  return filteredFaqs.slice(0, limit).map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));
}

/**
 * Fetch FAQs for events listing page
 * Returns FAQs linked to 2+ events
 */
export async function fetchFaqsForEventsPage(
  countrySlug?: string | null,
  limit: number = 6
): Promise<FAQItem[]> {
  const where: any = {
    events: {
      some: {},
    },
  };

  if (countrySlug) {
    where.countries = {
      some: {
        country: {
          slug: countrySlug,
        },
      },
    };
  }

  const allFaqs = await prisma.fAQ.findMany({
    where,
    include: {
      events: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const filteredFaqs = allFaqs.filter((faq) => faq.events.length >= 2);

  return filteredFaqs.slice(0, limit).map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));
}

/**
 * Fetch FAQs for courses listing page
 * Returns FAQs linked to 2+ courses
 */
export async function fetchFaqsForCoursesPage(
  countrySlug?: string | null,
  limit: number = 6
): Promise<FAQItem[]> {
  const where: any = {
    courses: {
      some: {},
    },
  };

  if (countrySlug) {
    where.countries = {
      some: {
        country: {
          slug: countrySlug,
        },
      },
    };
  }

  const allFaqs = await prisma.fAQ.findMany({
    where,
    include: {
      courses: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const filteredFaqs = allFaqs.filter((faq) => faq.courses.length >= 2);

  return filteredFaqs.slice(0, limit).map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));
}

/**
 * Fetch FAQs for destinations listing page
 * Returns FAQs linked to 2+ destinations
 */
export async function fetchFaqsForDestinationsPage(
  countrySlug?: string | null,
  limit: number = 6
): Promise<FAQItem[]> {
  const where: any = {
    destinations: {
      some: {},
    },
  };

  if (countrySlug) {
    where.countries = {
      some: {
        country: {
          slug: countrySlug,
        },
      },
    };
  }

  const allFaqs = await prisma.fAQ.findMany({
    where,
    include: {
      destinations: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const filteredFaqs = allFaqs.filter((faq) => faq.destinations.length >= 2);

  return filteredFaqs.slice(0, limit).map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));
}
