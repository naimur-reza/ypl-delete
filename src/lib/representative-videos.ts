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
  const baseQuery = {
    where: {
      type: "REPRESENTATIVE" as const,
      mediaType: "VIDEO" as const,
      ...(countrySlug
        ? {
            countries: {
              some: { country: { slug: countrySlug } },
            },
          }
        : {}),
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
  };

  const scoped = await prisma.testimonial.findMany(baseQuery);

  if (scoped.length > 0 || !countrySlug) {
    return scoped;
  }

  // Fallback to global set when no matches for country-specific query
  return prisma.testimonial.findMany({
    ...baseQuery,
    where: {
      type: "REPRESENTATIVE" as const,
      mediaType: "VIDEO" as const,
    },
  });
};
