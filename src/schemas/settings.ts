import { z } from "zod";

// Quick link structure
export const quickLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
});

// Footer settings schema
export const footerSettingsSchema = z.object({
  footerDestinations: z.array(z.string()).optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .nullable()
    .or(z.literal("")),
  contactAddress: z.string().optional().nullable(),
  quickLinks: z.array(quickLinkSchema).optional().nullable(),
  socialFacebook: z
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  socialYoutube: z
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  socialLinkedin: z
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  socialTwitter: z
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  socialInstagram: z
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  privacyPolicyUrl: z.string().optional().nullable(),
  termsOfServiceUrl: z.string().optional().nullable(),
  cookiePolicyUrl: z.string().optional().nullable(),
  footerDescription: z.string().optional().nullable(),
});

// Settings schema for API
export const settingsSchema = z.object({
  key: z.string().min(1, "Key is required"),
  ...footerSettingsSchema.shape,
});

export type FooterSettings = z.infer<typeof footerSettingsSchema>;
export type QuickLink = z.infer<typeof quickLinkSchema>;
export type Settings = z.infer<typeof settingsSchema>;
