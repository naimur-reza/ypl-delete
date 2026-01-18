import { z } from "zod";

export const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  learnMoreText: z.string().optional(),
  learnMoreUrl: z.string().optional(),
  backgroundType: z.enum(["IMAGE", "VIDEO", "YOUTUBE"]).default("IMAGE"),
  backgroundUrl: z.string().url("Must be a valid URL"),
  slug: z.string().min(1, "Slug is required"),
  // isActive removed in favor of status
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
  order: z.number().int().min(0).default(0),
  countryIds: z.array(z.string()).optional(),
});

export const updateHeroSchema = heroSchema.partial().extend({
  id: z.string(),
});

export type HeroInput = z.infer<typeof heroSchema>;
export type UpdateHeroInput = z.infer<typeof updateHeroSchema>;
