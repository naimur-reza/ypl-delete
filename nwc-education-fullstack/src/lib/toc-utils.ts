/**
 * Utility functions for generating Table of Contents from Markdown content.
 */

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Generates a URL-friendly slug from a heading text.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove duplicate hyphens
}

/**
 * Extracts headings (h2, h3) from Markdown content and returns an array of TocHeading.
 */
export function extractHeadings(markdown: string): TocHeading[] {
  if (!markdown) return [];

  const headings: TocHeading[] = [];
  // Match ## and ### headings in Markdown
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;

  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length; // 2 for h2, 3 for h3
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Adds IDs to h2 and h3 tags in HTML content for anchor linking.
 */
export function addHeadingIds(html: string): string {
  if (!html) return "";

  // Add IDs to h2 tags
  let result = html.replace(/<h2>(.+?)<\/h2>/gi, (match, content) => {
    const id = slugify(content.replace(/<[^>]+>/g, "")); // Strip any nested HTML
    return `<h2 id="${id}">${content}</h2>`;
  });

  // Add IDs to h3 tags
  result = result.replace(/<h3>(.+?)<\/h3>/gi, (match, content) => {
    const id = slugify(content.replace(/<[^>]+>/g, ""));
    return `<h3 id="${id}">${content}</h3>`;
  });

  return result;
}
