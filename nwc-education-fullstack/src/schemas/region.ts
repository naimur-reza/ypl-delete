import { z } from "zod";

const CountrySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(50),
  isoCode: z.string().min(2, "ISO code is required").max(2, "ISO code must be 2 characters long"),
  metaTitle: z.string().max(200).optional().nullable(),
  flag: z.string().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
});

export { CountrySchema };
