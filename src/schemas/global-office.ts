import { z } from "zod";

// Opening hours schema - stored as JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openingHoursSchema = z
  .record(z.string(), z.string())
  .optional()
  .nullable();

// Helper function to parse latitude/longitude from string or number
const coordinateSchema = z.union([
  z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  z
    .string()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const num = parseFloat(val);
      if (isNaN(num)) return null;
      return num;
    })
    .refine((val) => val === null || (val >= -90 && val <= 90), {
      message: "Latitude must be between -90 and 90",
    }),
]);

const longitudeSchema = z.union([
  z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  z
    .string()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const num = parseFloat(val);
      if (isNaN(num)) return null;
      return num;
    })
    .refine((val) => val === null || (val >= -180 && val <= 180), {
      message: "Longitude must be between -180 and 180",
    }),
]);

const globalOfficeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  subtitle: z
    .string()
    .max(200, "Subtitle must be less than 200 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters"),
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
    .nullable()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  latitude: coordinateSchema.optional().nullable(),
  longitude: longitudeSchema.optional().nullable(),
  mapEmbedUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  openingHours: openingHoursSchema,
  content: z
    .string()
    .optional()
    .nullable()
    .or(z.literal("")),
  countryIds: z.array(z.string()).optional().default([]),
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
  metaKeywords: z
    .string()
    .max(500, "Meta keywords must be less than 500 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export { globalOfficeSchema };
