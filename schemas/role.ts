import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  departmentId: z.string().min(1, "Department is required"),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
