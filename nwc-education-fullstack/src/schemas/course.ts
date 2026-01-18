import { z } from "zod";

// Study level enum values
const studyLevelEnum = z.enum([
  "FOUNDATION",
  "BACHELOR",
  "MASTER",
  "PHD",
  "DIPLOMA",
  "CERTIFICATE",
  "PATHWAY",
]);

// Faculty enum values
const facultyEnum = z.enum([
  "ENGINEERING",
  "BUSINESS",
  "ARTS_HUMANITIES",
  "SCIENCE",
  "MEDICINE_HEALTH",
  "LAW",
  "EDUCATION",
  "SOCIAL_SCIENCES",
  "IT_COMPUTING",
  "ARCHITECTURE",
  "AGRICULTURE",
  "HOSPITALITY_TOURISM",
  "MEDIA_COMMUNICATION",
  "OTHER",
]);

const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(50),
  description: z.string().optional().nullable(),
  summary: z.string().max(300).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  image: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  studyLevel: studyLevelEnum.optional().nullable(),
  faculty: facultyEnum.optional().nullable(),
  tuitionMin: z.number().min(0).optional().nullable(),
  tuitionMax: z.number().min(0).optional().nullable(),
  currency: z.string().default("USD").optional(),
  isFeatured: z.boolean().default(false).optional(),
  status: z.enum(["ACTIVE", "DRAFT"]),
  universityId: z.string().min(1, "University is required"),
  destinationId: z.string().min(1, "Destination is required"),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  sections: z
    .object({
      overview: z.string().optional(),
      entryRequirements: z.string().optional(),
      costOfStudy: z.string().optional(),
      scholarships: z.string().optional(),
      careers: z.string().optional(),
      admission: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export { courseSchema, studyLevelEnum, facultyEnum };
