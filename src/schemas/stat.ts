import { z } from "zod";

export const statSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  slideIndex: z.number().int().min(0).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  countryIds: z.array(z.string()).optional(),
});

export const updateStatSchema = statSchema.partial().extend({
  id: z.string(),
});

export type StatInput = z.infer<typeof statSchema>;
export type UpdateStatInput = z.infer<typeof updateStatSchema>;
