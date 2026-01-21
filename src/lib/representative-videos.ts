import { prisma } from "./prisma";

// Testimonial with type REPRESENTATIVE replaces old RepresentativeVideo model
export type RepresentativeVideo = {
  id: string;
  name: string;
  videoUrl: string | null;
  avatar: string | null;
  content: string | null;
  countries?: { country: { name: string; slug: string } }[];
};

export const fetchRepresentativeVideos = async (
  countrySlug?: string | null
): Promise<RepresentativeVideo[]> => {
  // Build country/global filter
  let countryFilter: any = {};
  if (countrySlug) {
    // When on a country route, show country-specific videos OR global videos
    countryFilter = {
      OR: [
        {
          countries: {
            some: { country: { slug: countrySlug } },
          },
        },
        {
          isGlobal: true,
        },
      ],
    };
  } else {
    // When on global route (no countrySlug), show only global videos
    countryFilter = {
      isGlobal: true,
    };
  }

  return prisma.testimonial.findMany({
    where: {
      status: "ACTIVE" as any,
      type: "REPRESENTATIVE" as const,
      mediaType: "VIDEO" as const,
      ...countryFilter,
    },
    select: {
      id: true,
      name: true,
      videoUrl: true,
      avatar: true,
      content: true,
      countries: {
        select: {
          country: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { order: "asc" as const },
    take: 12,
  });
};

