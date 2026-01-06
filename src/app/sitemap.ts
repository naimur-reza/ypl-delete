import { prisma } from "@/lib/prisma";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nwceducation.com";

export default async function sitemap() {
  const [
    countries,
    destinations,
    universities,
    courses,
    events,
    scholarships,
    blogs,
    intakePages,
  ] = await Promise.all([
    prisma.country.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.destination.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.university.findMany({
      select: {
        slug: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
    prisma.course.findMany({
      select: {
        slug: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
    prisma.event.findMany({
      select: {
        slug: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
    prisma.scholarship.findMany({
      select: {
        slug: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
    prisma.blog.findMany({
      select: {
        slug: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
    prisma.intakePage.findMany({
      select: {
        intake: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
  ]);

  const staticUrls = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    ...countries.map((c) => ({
      url: `${baseUrl}/${c.slug}`,
      lastModified: c.updatedAt,
    })),
  ];

  const destinationUrls = destinations.map((d) => ({
    url: `${baseUrl}/study-abroad/${d.slug}`,
    lastModified: d.updatedAt,
  }));

  const universityUrls = universities.map((u) => ({
    url: `${baseUrl}/${u.destination.slug}/universities/${u.slug}`,
    lastModified: u.updatedAt,
  }));

  const courseUrls = courses.map((c) => ({
    url: `${baseUrl}/${c.destination.slug}/courses/${c.slug}`,
    lastModified: c.updatedAt,
  }));

  const eventUrls = events.map((e) => ({
    url: `${baseUrl}/${e.destination.slug}/events/${e.slug}`,
    lastModified: e.updatedAt,
  }));

  const scholarshipUrls = scholarships.map((s) => ({
    url: `${baseUrl}/${s.destination.slug}/scholarships/${s.slug}`,
    lastModified: s.updatedAt,
  }));

  const blogUrls = blogs.map((b) => ({
    url: `${baseUrl}/${b.destination.slug}/blogs/${b.slug}`,
    lastModified: b.updatedAt,
  }));

  const intakeUrls = intakePages.map((ip) => ({
    url: `${baseUrl}/${ip.destination.slug}/program/${
      ip.destination.slug
    }/${ip.intake.toLowerCase()}`,
    lastModified: ip.updatedAt,
  }));

  return [
    ...staticUrls,
    ...destinationUrls,
    ...universityUrls,
    ...courseUrls,
    ...eventUrls,
    ...scholarshipUrls,
    ...blogUrls,
    ...intakeUrls,
  ];
}
