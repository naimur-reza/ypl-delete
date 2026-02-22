import { z } from "zod";

export const candidateSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required")
    .max(100, "Name is too long"),

  email: z.string().email("Invalid email address"),

  mobileNumber: z
    .string()
    .min(7, "Invalid phone number")
    .max(15, "Invalid phone number")
    .regex(/^[0-9+()\-\s]+$/, "Invalid phone number"),

  professionalQualification: z.string().max(200).optional().or(z.literal("")),

  educationalQualification: z.string().max(200).optional().or(z.literal("")),

  totalExperience: z.string().optional().or(z.literal("")),

  currentPosition: z.string().max(100).optional().or(z.literal("")),

  department: z.string().max(100).optional().or(z.literal("")),

  currentOrganization: z.string().max(100).optional().or(z.literal("")),

  previousOrganizations: z.string().max(200).optional().or(z.literal("")),

  industry: z.string().max(100).optional().or(z.literal("")),

  currentSalary: z.string().optional().or(z.literal("")),

  expectedSalary: z.string().optional().or(z.literal("")),

  availableFromDate: z.string().optional().or(z.literal("")),

  location: z.string().min(2, "Location is required").max(100),

  cvFile: z
    .instanceof(File, { message: "CV file is required" })
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "Only PDF, DOC, or DOCX files are allowed",
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "CV must be less than 5MB")
    .nullable(),
});

export type TCandidateForm = z.infer<typeof candidateSchema>;
