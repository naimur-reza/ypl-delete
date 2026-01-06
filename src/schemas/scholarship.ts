import { z } from "zod";

export const scholarshipSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  summary: z.string().max(300).optional().nullable(),
  amount: z.string().optional().nullable(),
  eligibility: z.string().max(500).optional().nullable(),
  deadline: z.string().optional().nullable(),
  universityId: z.string().optional().nullable(),
  destinationId: z.string().min(1, "Destination is required"),
  isActive: z.boolean().optional().default(true),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  // New fields for details page
  overview: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  eligibilityCriteria: z.string().optional().nullable(),
  levelAndField: z.string().optional().nullable(),
  providerInfo: z.string().optional().nullable(),
  requiredDocuments: z.string().optional().nullable(),
  howToApply: z.string().optional().nullable(),
});
