import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
