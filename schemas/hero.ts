import { z } from "zod";

export const heroSchema = z.object({
  badgeText: z.string().min(1, "Badge text is required"),
  title: z.string().min(1, "Title is required"),
  highlightText: z.string().min(1, "Highlight text is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  primaryBtnText: z.string().optional(),
  primaryBtnLink: z.string().optional(),
  secondaryBtnText: z.string().optional(),
  secondaryBtnLink: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export type HeroFormData = z.infer<typeof heroSchema>;
