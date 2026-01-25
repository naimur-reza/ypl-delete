import { z } from "zod";

export const essentialSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  slug: z.string().min(1, "Slug is required").max(100),
  destinationId: z.string().min(1, "Destination is required"),
  description: z.string().max(400).optional().nullable(),
  content: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
  isGlobal: z.boolean().optional().default(false),
  countryIds: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  if (!data.isGlobal && (!data.countryIds || data.countryIds.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select at least one country",
      path: ["countryIds"],
    });
  }
});
