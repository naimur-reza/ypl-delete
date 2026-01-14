import { z } from "zod";

const destinationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(50),
  countryIds: z.array(z.string().min(1)).min(1, "Select at least one country"),
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
});

export { destinationSchema };
