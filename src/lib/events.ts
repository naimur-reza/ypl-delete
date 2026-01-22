import { Prisma } from "../../prisma/src/generated/prisma/client";
import { prisma } from "./prisma";

export type EventWithRelations = Prisma.EventGetPayload<{
  include: {
    destination: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    university: {
      select: {
        id: true;
        name: true;
        logo: true;
        slug: true;
      };
    };
    countries: {
      include: {
        country: {
          select: {
            id: true;
            name: true;
            slug: true;
          };
        };
      };
    };
  };
}>;

export type EventPageQuery = {
  countrySlug?: string | null;
  featuredOnly?: boolean;
  limit?: number; // Added limit
};

export const fetchUpcomingEvents = async ({
  countrySlug,
  featuredOnly,
  limit, // Destructure limit
}: EventPageQuery): Promise<EventWithRelations[]> => {
  const now = new Date();

  // Build country/global filter
  let countryFilter: Prisma.EventWhereInput = {};
  if (countrySlug) {
    // When on a country route, show country-specific events OR global events
    countryFilter = {
      OR: [
        {
          countries: {
            some: {
              country: { slug: countrySlug },
            },
          },
        },
        {
          isGlobal: true,
        },
      ],
    };
  } else {
    // When on global route (no countrySlug), show only global events
    countryFilter = {
      isGlobal: true,
    };
  }

  const where: Prisma.EventWhereInput = {
    startDate: { gte: now },
    status: "ACTIVE",
    ...(featuredOnly ? { isFeatured: true } : {}),
    ...countryFilter,
  };

  return prisma.event.findMany({
    where,
    include: {
      destination: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      university: {
        select: {
          id: true,
          name: true,
          logo: true,
          slug: true,
        },
      },
      countries: {
        include: {
          country: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: { startDate: "asc" },
    take: limit, // Use dynamic limit
  });
};

export const fetchPastEvents = async ({
  countrySlug,
}: EventPageQuery): Promise<EventWithRelations[]> => {
  const now = new Date();

  // Build country/global filter
  let countryFilter: Prisma.EventWhereInput = {};
  if (countrySlug) {
    // When on a country route, show country-specific events OR global events
    countryFilter = {
      OR: [
        {
          countries: {
            some: {
              country: { slug: countrySlug },
            },
          },
        },
        {
          isGlobal: true,
        },
      ],
    };
  } else {
    // When on global route (no countrySlug), show only global events
    countryFilter = {
      isGlobal: true,
    };
  }

  const where: Prisma.EventWhereInput = {
    startDate: { lt: now },
    status: "ACTIVE",
    ...countryFilter,
  };

  return prisma.event.findMany({
    where,
    include: {
      destination: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      university: {
        select: {
          id: true,
          name: true,
          logo: true,
          slug: true,
        },
      },
      countries: {
        include: {
          country: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: { startDate: "desc" },
    take: 9,
  });
};

const eventListingInclude = {
  destination: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  university: {
    select: {
      id: true,
      name: true,
      logo: true,
      slug: true,
    },
  },
  countries: {
    include: {
      country: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
} as const;

/**
 * Fetches all events (upcoming + past) for the events listing.
 * Order: upcoming first (asc), then past (desc, most recent first).
 * Respects country filter (country-specific + global when countrySlug provided).
 */
export const fetchAllEventsForListing = async ({
  countrySlug,
}: EventPageQuery): Promise<EventWithRelations[]> => {
  const now = new Date();

  let countryFilter: Prisma.EventWhereInput = {};
  if (countrySlug) {
    countryFilter = {
      OR: [
        {
          countries: {
            some: {
              country: { slug: countrySlug },
            },
          },
        },
        { isGlobal: true },
      ],
    };
  } else {
    countryFilter = { isGlobal: true };
  }

  const baseWhere: Prisma.EventWhereInput = {
    status: "ACTIVE",
    ...countryFilter,
  };

  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { ...baseWhere, startDate: { gte: now } },
      include: eventListingInclude,
      orderBy: { startDate: "asc" },
    }),
    prisma.event.findMany({
      where: { ...baseWhere, startDate: { lt: now } },
      include: eventListingInclude,
      orderBy: { startDate: "desc" },
    }),
  ]);

  return [...upcoming, ...past];
};
