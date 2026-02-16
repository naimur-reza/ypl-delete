import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nwceducation.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Fetch all dynamic data in parallel ─────────────────────────────
  const [
    countries,
    destinations,
    universities,
    courses,
    events,
    scholarships,
    blogs,
    intakePages,
    services,
    careers,
    essentialStudies,
    globalOffices,
  ] = await Promise.all([
    prisma.country.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.destination.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.university.findMany({
      where: { status: "ACTIVE" },
      select: {
        slug: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
    prisma.course.findMany({
      where: { status: "ACTIVE" },
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
      where: { status: "ACTIVE" },
      select: {
        slug: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
    prisma.blog.findMany({
      where: { status: "ACTIVE" },
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
    prisma.service.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.career.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.essentialStudy.findMany({
      where: { status: "ACTIVE" },
      select: {
        slug: true,
        updatedAt: true,
        destination: { select: { slug: true } },
      },
    }),
    prisma.globalOffice.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const now = new Date();

  // ── 1. Static pages (root level) ──────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/study-abroad`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/universities`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/scholarships`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blogs`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/global-branches`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/intakes`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/apply-now`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── 2. Country home pages ─────────────────────────────────────────
  const countryHomeUrls: MetadataRoute.Sitemap = countries
    .filter((c) => c && c.slug)
    .map((c) => ({
      url: `${baseUrl}/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

  // ── 3. Country-scoped listing pages ───────────────────────────────
  const countryListingPaths = [
    "study-abroad",
    "universities",
    "courses",
    "events",
    "scholarships",
    "blogs",
    "services",
    "careers",
    "gallery",
    "intakes",
    "apply-now",
    "global-branches",
  ];

  const countryListingUrls: MetadataRoute.Sitemap = countries
    .filter((c) => c && c.slug)
    .flatMap((c) =>
      countryListingPaths.map((path) => ({
        url: `${baseUrl}/${c.slug}/${path}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );

  // ── 4. Destination pages ──────────────────────────────────────────
  const destinationUrls: MetadataRoute.Sitemap = destinations
    .filter((d) => d && d.slug)
    .map((d) => ({
      url: `${baseUrl}/study-abroad/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // ── 5. University detail pages ────────────────────────────────────
  const universityUrls: MetadataRoute.Sitemap = universities
    .filter((u) => u && u.slug && u.destination && u.destination.slug)
    .map((u) => ({
      url: `${baseUrl}/${u.destination.slug}/universities/${u.slug}`,
      lastModified: u.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // ── 6. Course detail pages ────────────────────────────────────────
  const courseUrls: MetadataRoute.Sitemap = courses
    .filter((c) => c && c.slug && c.destination && c.destination.slug)
    .map((c) => ({
      url: `${baseUrl}/${c.destination.slug}/courses/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // ── 7. Event detail pages ─────────────────────────────────────────
  const eventUrls: MetadataRoute.Sitemap = events
    .filter((e) => e && e.slug && e.destination && e.destination.slug)
    .map((e) => ({
      url: `${baseUrl}/${e.destination!.slug}/events/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // ── 8. Scholarship detail pages ───────────────────────────────────
  const scholarshipUrls: MetadataRoute.Sitemap = scholarships
    .filter((s) => s && s.slug && s.destination && s.destination.slug)
    .map((s) => ({
      url: `${baseUrl}/${s.destination.slug}/scholarships/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // ── 9. Blog detail pages ──────────────────────────────────────────
  const blogUrls: MetadataRoute.Sitemap = blogs
    .filter((b) => b && b.slug && b.destination && b.destination.slug)
    .map((b) => ({
      url: `${baseUrl}/${b.destination.slug}/blogs/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // ── 10. Intake pages ──────────────────────────────────────────────
  const intakeUrls: MetadataRoute.Sitemap = intakePages
    .filter(
      (ip) =>
        ip &&
        ip.intake &&
        ip.destination &&
        ip.destination.slug &&
        typeof ip.intake === "string"
    )
    .map((ip) => ({
      url: `${baseUrl}/${ip.destination!.slug}/program/${ip.destination!.slug}/${ip.intake!.toLowerCase()}`,
      lastModified: ip.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // ── 11. Service detail pages ──────────────────────────────────────
  const serviceUrls: MetadataRoute.Sitemap = services
    .filter((s) => s && s.slug)
    .map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // ── 12. Career detail pages ───────────────────────────────────────
  const careerUrls: MetadataRoute.Sitemap = careers
    .filter((c) => c && c.slug)
    .map((c) => ({
      url: `${baseUrl}/careers/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  // ── 13. Essential study pages ─────────────────────────────────────
  const essentialUrls: MetadataRoute.Sitemap = essentialStudies
    .filter((e) => e && e.slug)
    .map((e) => ({
      url: `${baseUrl}/essential/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  // ── 14. Global office detail pages ────────────────────────────────
  const globalOfficeUrls: MetadataRoute.Sitemap = globalOffices
    .filter((o) => o && o.slug)
    .map((o) => ({
      url: `${baseUrl}/global-branches/${o.slug}`,
      lastModified: o.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  // ── Combine all URLs ──────────────────────────────────────────────
  return [
    ...staticPages,
    ...countryHomeUrls,
    ...countryListingUrls,
    ...destinationUrls,
    ...universityUrls,
    ...courseUrls,
    ...eventUrls,
    ...scholarshipUrls,
    ...blogUrls,
    ...intakeUrls,
    ...serviceUrls,
    ...careerUrls,
    ...essentialUrls,
    ...globalOfficeUrls,
  ];
}
