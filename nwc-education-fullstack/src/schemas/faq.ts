import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.string().min(1, "Answer is required").max(2000),
  status: z.enum(["ACTIVE", "DRAFT"]),
  countryIds: z.array(z.string()).optional().default([]),
  destinationIds: z.array(z.string()).optional().default([]),
  universityIds: z.array(z.string()).optional().default([]),
  eventIds: z.array(z.string()).optional().default([]),
  courseIds: z.array(z.string()).optional().default([]),
  scholarshipIds: z.array(z.string()).optional().default([]),
  intakePageIds: z.array(z.string()).optional().default([]),
  isGlobal: z.boolean().optional().default(false),
});
