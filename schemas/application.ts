import { z } from "zod";

export const applicationSchema = z.object({
  _id: z.string().optional(),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().default(""),
  cvUrl: z.string().default(""),
  coverLetter: z.string().default(""),
  career: z.string().min(1, "Career/Job is required"),
  branch: z.string().optional(),
  status: z.enum(["new", "reviewed", "shortlisted", "rejected", "hired"]).default("new"),
});

export type TApplicationForm = z.infer<typeof applicationSchema>;
