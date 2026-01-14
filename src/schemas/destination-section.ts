import { z } from "zod";

export const destinationSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  status: z.enum(["ACTIVE", "DRAFT"]),
  destinationId: z.string().min(1, "Destination is required"),
});

export type DestinationSectionFormData = z.infer<typeof destinationSectionSchema>;
