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

  const where: Prisma.EventWhereInput = {
    startDate: { gte: now },
    status: "ACTIVE",
    ...(featuredOnly ? { isFeatured: true } : {}),
    ...(countrySlug
      ? {
          countries: {
            some: {
              country: { slug: countrySlug },
            },
          },
        }
      : {}),
      
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

  const where: Prisma.EventWhereInput = {
    startDate: { lt: now },
    status: "ACTIVE",
    ...(countrySlug
      ? {
          countries: {
            some: {
              country: { slug: countrySlug },
            },
          },
        }
      : {}),
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
