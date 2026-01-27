import { z } from "zod";

// Base schema without refinements (for compatibility with .partial())
const statBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  slideIndex: z.number().int().min(0).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
  isGlobal: z.boolean().optional().default(false),
  countryIds: z.array(z.string()).default([]),
});

// Schema with refinement for validation
export const statSchema = statBaseSchema.refine(
  (data) => data.isGlobal || (data.countryIds && data.countryIds.length > 0),
  {
    message: "Select at least one country (or mark as Global)",
    path: ["countryIds"],
  }
);

// Use base schema for .partial() to avoid refinement issues
export const updateStatSchema = statBaseSchema.partial().extend({
  id: z.string(),
});

export type StatInput = z.infer<typeof statSchema>;
export type UpdateStatInput = z.infer<typeof updateStatSchema>;

