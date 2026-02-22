import { z } from "zod";

export const branchSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  location: z.string().min(2, "Location is required"),
  contactEmail: z.string().email("Invalid email").or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type TBranchForm = z.infer<typeof branchSchema>;
