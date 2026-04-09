import type { CandidateLead } from "./types";

export function isCvExpired(item: CandidateLead) {
  const sourceDate = item.createdAt || item.submittedAt;
  if (!sourceDate) return false;
  const createdTime = new Date(sourceDate).getTime();
  if (Number.isNaN(createdTime)) return false;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return createdTime < sixMonthsAgo.getTime();
}

export function getInlineCvUrl(url: string) {
  const normalizedUrl = normalizeCloudinaryUrl(url);

  if (normalizedUrl.includes("res.cloudinary.com")) {
    // Document assets should be opened directly; inline transforms can be blocked by origin/security policies.
    const lowerUrl = normalizedUrl.toLowerCase();
    const isDocument =
      lowerUrl.endsWith(".pdf") ||
      lowerUrl.endsWith(".doc") ||
      lowerUrl.endsWith(".docx");
    if (isDocument || normalizedUrl.includes("/raw/upload/")) return normalizedUrl;
    if (normalizedUrl.includes("/image/upload/")) {
      return normalizedUrl.replace("/upload/", "/upload/fl_inline/");
    }
  }
  return normalizedUrl;
}

export function normalizeCloudinaryUrl(url: string) {
  if (!url) return url;
  return url.replace(
    /^https?:\/\/res\.cloudinary\.com(?!\/)/i,
    "https://res.cloudinary.com/"
  );
}
