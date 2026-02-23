import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().default("briefcase"),
  features: z.array(z.string()).default([]),
  image: z.string().default(""),
  content: z.string().default(""),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
