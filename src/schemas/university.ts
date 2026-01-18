import { z } from "zod";

const providerTypeEnum = z.enum([
  "UNIVERSITY",
  "GOVERNMENT",
  "PRIVATE",
  "EMBASSY",
]);

const universitySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(50),
  logo: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  providerType: providerTypeEnum,
  isFeatured: z.boolean().default(false).optional(),
  website: z.string().url().optional().or(z.literal("")).nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  countryIds: z.array(z.string().min(1)).min(1, "Select at least one country"),
  destinationId: z.string().min(1, "Destination is required"),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]),
  rankingNumber: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().int().positive().nullable().optional()
  ),
  costOfStudying: z.string().optional().nullable(),
  // Details
  overview: z.string().optional().nullable(),
  ranking: z.string().optional().nullable(),
  tuitionFees: z.string().optional().nullable(),
  famousFor: z.string().optional().nullable(),
  servicesHeading: z.string().optional().nullable(),
  servicesDescription: z.string().optional().nullable(),
  servicesImage: z.string().optional().nullable(),
  entryRequirements: z.string().optional().nullable(),
  // Additional detail fields
  accommodation: z.string().optional().nullable(),
  accommodationImage: z.string().optional().nullable(),
});

export { universitySchema };
