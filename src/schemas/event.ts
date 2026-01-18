import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().optional().nullable(),
  eventType: z.enum([
    "EXPO",
    "WEBINAR",
    "ADMISSION_DAY",
    "OPEN_DAY",
    "SEMINAR",
    "WORKSHOP",
  ]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  city: z.string().max(200).optional().nullable(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
  destinationIds: z
    .array(z.string().min(1))
    .min(1, "Select at least one destination")
    .nullable(),
  banner: z
    .string()
    .url({ message: "Banner must be a valid URL" })
    .optional()
    .nullable(),
  universityId: z.string().optional().nullable(),
  countryIds: z.array(z.string()).default([]),
  // Post-event fields
  video: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      { message: "Must be a valid URL" }
    ),
  gallery: z.array(z.string().url()).optional().nullable(),
  successSummary: z.string().optional().nullable(),
  // SEO fields
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
});
