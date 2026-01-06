const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nwceducation.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/study-abroad",
        "/universities",
        "/courses",
        "/events",
        "/scholarships",
        "/blogs",
      ],
      disallow: ["/dashboard", "/admin", "/api", "/auth", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
