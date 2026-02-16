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
        "/services",
        "/careers",
        "/gallery",
        "/global-branches",
        "/essential",
        "/intakes",
        "/apply-now",
        "/privacy-policy",
        "/terms-and-conditions",
      ],
      disallow: ["/dashboard", "/admin", "/api", "/auth", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
