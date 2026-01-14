import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().optional().nullable(),
  image: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .nullable(),
  author: z.string().max(100).optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  destinationId: z.string().min(1, "Destination is required"),
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
  countryIds: z.array(z.string()).optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
});
