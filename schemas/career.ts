import { z } from "zod";

export const careerSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  company: z.string().default(""),
  description: z.string().min(10, "Description is required"),
  requirements: z.array(z.string()).default([]),
  location: z.string().min(2, "Location is required"),
  type: z.string().default("Full-time"),
  salary: z.string().default(""),
  category: z.string().default(""),
  department: z.string().default(""),
  branch: z.string().optional(),
  postedDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type TCareerForm = z.infer<typeof careerSchema>;
