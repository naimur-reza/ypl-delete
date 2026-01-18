import type { Metadata } from "next";

type BaseMeta = {
  title?: string | null;
  description?: string | null;
  keywords?: string | null | string[];
  images?: string | string[] | null;
  url?: string | null;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window === "undefined" ? undefined : window.location.origin);

function normalizeKeywords(
  keywords?: string | string[] | null
): string[] | undefined {
  if (!keywords) return undefined;
  if (Array.isArray(keywords)) return keywords.filter(Boolean);
  return keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

function normalizeImages(
  images?: string | string[] | null
): string[] | undefined {
  if (!images) return undefined;
  return (Array.isArray(images) ? images : [images]).filter(
    Boolean
  ) as string[];
}

export function buildMetadata({
  title,
  description,
  keywords,
  images,
  url,
}: BaseMeta): Metadata {
  const resolvedTitle = title || "NWC Education";
  const resolvedDescription =
    description || "NWC Education - Global education guidance and services.";
  const resolvedKeywords = normalizeKeywords(keywords);
  const resolvedImages = normalizeImages(images);

  const absoluteUrl =
    url && siteUrl ? new URL(url, siteUrl).toString() : url || siteUrl;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: absoluteUrl,
      images: resolvedImages,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: resolvedImages,
    },
  };
}
