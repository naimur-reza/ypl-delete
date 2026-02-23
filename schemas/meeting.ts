import { z } from "zod";

export const meetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.coerce.date({
    required_error: "Start time is required",
  }),
  endTime: z.coerce.date({
    required_error: "End time is required",
  }),
  location: z.string().optional(),
  meetingLink: z.string().url("Invalid meeting link").optional().or(z.literal("")),
  attendees: z.array(z.string().email("Invalid email")).optional().default([]),
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
  relatedTo: z.string().optional(),
});

export type MeetingFormData = z.infer<typeof meetingSchema>;
