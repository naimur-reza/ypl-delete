import { z } from "zod";

export const serviceSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  icon: z.string().default("briefcase"),
  features: z.array(z.string()).default([]),
  image: z.string().default(""),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type TServiceForm = z.infer<typeof serviceSchema>;
