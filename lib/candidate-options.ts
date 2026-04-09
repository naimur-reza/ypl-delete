/** Shared option lists for CV submission and admin candidate forms */

export const POSITIONS = [
  "Strategic Level",
  "Management Level",
  "Mid Level",
  "Entry Level",
] as const;

export const INDUSTRIES = [
  "Manufacturing",
  "Service",
  "Financial Institutions",
  "Real Estate & Construction",
  "Telecom",
  "Energy & Power",
] as const;

export const QUALIFICATIONS_ACADEMIC = ["BBA / MBA", "BSc / MSc"] as const;
export const QUALIFICATIONS_PROFESSIONAL = [
  "CA (ICAB)",
  "CMA (ICMAB)",
  "ACCA",
  "CIMA",
] as const;

export const AVAILABILITY = ["Immediate", "15 Days", "1 Month+"] as const;

export const LOCATIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Outside Bangladesh",
] as const;

/** Admin form labels use slightly different export names */
export const ACADEMIC_QUALIFICATIONS = [...QUALIFICATIONS_ACADEMIC];
