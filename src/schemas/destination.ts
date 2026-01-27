import { z } from "zod";

// Base schema without refinements for compatibility with .partial()
const destinationBaseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(50),
  countryIds: z.array(z.string()).default([]),
  heroTitle: z.string().max(200).optional().nullable(),
  heroSubtitle: z.string().max(300).optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  whyChoose: z.string().optional().nullable(),
  topUniversities: z.string().optional().nullable(),
  campusAndCommunity: z.string().optional().nullable(),
  destinationLife: z.string().optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]),
  isGlobal: z.boolean().optional().default(false),
});

// Add refinement for validation only (not used for .partial())
const destinationSchema = destinationBaseSchema.refine(
  (data) => data.isGlobal || (data.countryIds && data.countryIds.length > 0),
  {
    message: "Select at least one country (or mark as Global)",
    path: ["countryIds"],
  }
);

export { destinationSchema, destinationBaseSchema };
