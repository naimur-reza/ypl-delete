import { z } from "zod";

const globalOfficeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  subtitle: z
    .string()
    .max(200, "Subtitle must be less than 200 characters")
    .optional()
    .nullable(),
  slug: z.string().optional().nullable(),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .nullable()
    .or(z.literal("")),
  phone: z
    .string()
    .max(50, "Phone must be less than 50 characters")
    .optional()
    .nullable(),
  address: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .optional()
    .nullable(),
  mapUrl: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  openingHours: z.any().optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]),
  metaTitle: z
    .string()
    .max(200, "Meta title must be less than 200 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(500, "Meta description must be less than 500 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  metaKeywords: z.string().optional().nullable().or(z.literal("")),
  countryIds: z.array(z.string()).optional(),
});

export { globalOfficeSchema };
