import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["webinar", "workshop", "meetup", "other"]),
  isActive: z.boolean().default(true),
  createdBy: z.string().optional(),
  imageUrl: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  registrationLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
});
