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
    ...countries
      .filter((c) => c && c.slug)
      .map((c) => ({
        url: `${baseUrl}/${c.slug}`,
        lastModified: c.updatedAt,
      })),
  ];

  const destinationUrls = destinations
    .filter((d) => d && d.slug)
    .map((d) => ({
      url: `${baseUrl}/study-abroad/${d.slug}`,
      lastModified: d.updatedAt,
    }));

  const universityUrls = universities
    .filter((u) => u && u.slug && u.destination && u.destination.slug)
    .map((u) => ({
      url: `${baseUrl}/${u.destination.slug}/universities/${u.slug}`,
      lastModified: u.updatedAt,
    }));

  const courseUrls = courses
    .filter((c) => c && c.slug && c.destination && c.destination.slug)
    .map((c) => ({
      url: `${baseUrl}/${c.destination.slug}/courses/${c.slug}`,
      lastModified: c.updatedAt,
    }));

  // const eventUrls = events
  //   .filter((e) => e && e.slug && e.destination && e.destination.slug)
  //   .map((e) => ({
  //     url: `${baseUrl}/${e.destination.slug}/events/${e.slug}`,
  //     lastModified: e.updatedAt,
  //   }));

  const scholarshipUrls = scholarships
    .filter((s) => s && s.slug && s.destination && s.destination.slug)
    .map((s) => ({
      url: `${baseUrl}/${s.destination.slug}/scholarships/${s.slug}`,
      lastModified: s.updatedAt,
    }));

  const blogUrls = blogs
    .filter((b) => b && b.slug && b.destination && b.destination.slug)
    .map((b) => ({
      url: `${baseUrl}/${b.destination.slug}/blogs/${b.slug}`,
      lastModified: b.updatedAt,
    }));

  const intakeUrls = intakePages
    .filter(
      (ip) =>
        ip &&
        ip.intake &&
        ip.destination &&
        ip.destination.slug &&
        typeof ip.intake === "string"
    )
    .map((ip) => ({
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
    // ...eventUrls,
    ...scholarshipUrls,
    ...blogUrls,
    ...intakeUrls,
  ];
}
