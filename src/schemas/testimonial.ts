import { z } from "zod";

// Match Prisma Enum
export const testimonialTypeSchema = z.enum(["STUDENT", "REPRESENTATIVE", "GMB"]);
export const mediaTypeSchema = z.enum(["IMAGE", "VIDEO", "TEXT_ONLY"]);

export const testimonialSchema = z.object({
  type: testimonialTypeSchema,
  mediaType: mediaTypeSchema,
  
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().optional().nullable(), // For representatives
  content: z.string().optional().nullable(),
  
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  
  // Media
  avatar: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  videoUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")), // GMB Link
  
  // Relations
  countryIds: z.array(z.string()),
  destinationIds: z.array(z.string()),
  universityIds: z.array(z.string()),
  eventIds: z.array(z.string()),
  
  // Visibility
  isFeatured: z.boolean(),
  order: z.coerce.number(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
