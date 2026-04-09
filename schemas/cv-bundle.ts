import { z } from "zod";

export const createCvBundleSchema = z.object({
  bundleName: z.string().min(1, "Bundle name is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Invalid company email").optional().or(z.literal("")),
  candidateIds: z.array(z.string().min(1)).min(1, "Select at least one candidate"),
  notes: z.string().optional().or(z.literal("")),
});

export const updateCvBundleSchema = z.object({
  bundleName: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  companyEmail: z.string().email("Invalid company email").optional().or(z.literal("")),
  status: z.enum(["New", "Contacted", "Qualified", "Converted"]).optional(),
  notes: z.string().optional().or(z.literal("")),
  sentAt: z.union([z.string(), z.date()]).optional().nullable(),
});

export const updateBundleCandidatesSchema = z.object({
  updates: z
    .array(
      z.object({
        leadId: z.string().min(1),
        status: z.enum(["New", "Contacted", "Qualified", "Converted"]),
      })
    )
    .min(1, "No updates provided"),
});

export const uploadInvoiceSchema = z.object({
  invoiceUrl: z.string().url("Invalid invoice URL"),
});

