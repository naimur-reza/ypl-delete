import { z } from "zod";

const providerTypeEnum = z.enum([
  "UNIVERSITY",
  "GOVERNMENT",
  "PRIVATE",
  "EMBASSY",
]);

const universitySchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    slug: z.string().min(1, "Slug is required").max(50),
    logo: z.string().optional().nullable(),
    thumbnail: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    providerType: providerTypeEnum,
    isFeatured: z.boolean().default(false).optional(),
    isGlobal: z.boolean().optional().default(false),
    website: z.string().optional().nullable().or(z.literal("")),
    address: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable().or(z.literal("")),
    countryIds: z.array(z.string()).default([]),
    destinationId: z.string().min(1, "Destination is required"),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    metaKeywords: z.string().optional().nullable(),
    status: z.enum(["ACTIVE", "DRAFT"]),
    rankingNumber: z.preprocess(
      (val) => (val === "" || val === null ? null : Number(val)),
      z.number().int().nullable().optional()
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
  })
  .superRefine((data, ctx) => {
    if (!data.isGlobal && (!data.countryIds || data.countryIds.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one country",
        path: ["countryIds"],
      });
    }
  });

export { universitySchema };
