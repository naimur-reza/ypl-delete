import { prisma } from "@/lib/prisma";
import { resolveCountryContext } from "@/lib/country-resolver";
import { GallerySection } from "@/app/[country]/(public)/(home)/components";

export const metadata = {
  title: "Gallery | NWC Education",
  description: "Explore our collection of visa success stories, team moments, and memorable events.",
};

type PageProps = {
  params?: Promise<{ country?: string }>;
};

export default async function GalleryPage({ params }: PageProps) {
  const resolvedParams = (await params) ?? { country: null };
  const resolvedCountry = await resolveCountryContext(resolvedParams.country);
  const countrySlug = resolvedCountry.slug;

  const gallery = await prisma.gallery.findMany({
    where: {
      isActive: true,
      ...(countrySlug && {
        countries: {
          some: {
            country: {
              slug: countrySlug,
            },
          },
        },
      }),
    },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      type: true,
    },
  });

  return (
    <div className="min-h-screen">
      <GallerySection gallery={gallery} />
    </div>
  );
}
