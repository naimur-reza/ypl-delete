"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-field-context";

/* ───────── Option lists (from CV Search Flowchart) ───────── */
const DEPARTMENTS = [
  "Finance & Accounts",
  "Human Resources",
  "Sales & Marketing",
  "Supply Chain / Procurement",
  "Operations",
  "IT & Technology",
];

const POSITIONS = [
  "Strategic Level",
  "Management Level",
  "Mid Level",
  "Entry Level",
];

const INDUSTRIES = [
  "Manufacturing",
  "Service",
  "Financial Institutions",
  "Real Estate & Construction",
  "Telecom",
  "Energy & Power",
];

const QUALIFICATIONS_ACADEMIC = [
  "BBA / MBA",
  "BSc / MSc",
];

const QUALIFICATIONS_PROFESSIONAL = [
  "CA (ICAB)",
  "CMA (ICMAB)",
  "ACCA",
  "CIMA",
];

const EXPERIENCE_RANGES = [
  "0-3 Years",
  "4-7 Years",
  "8-12 Years",
  "13-18 Years",
  "19+ Years",
];

const AVAILABILITY = [
  "Immediate",
  "15 Days",
  "1 Month+",
];

const LOCATIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Outside Bangladesh",
];

/* ───────── Modal ───────── */
export function SalaryGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      professionalQualification: "",
      educationalQualification: "",
      totalExperience: "",
      currentPosition: "",
      department: "",
      currentOrganization: "",
      previousOrganizations: "",
      industry: "",
      currentSalary: "",
      expectedSalary: "",
      availableFromDate: "",
      location: "",
      cvUrl: "",
    },
    onSubmit: async ({ value }) => {
      const res = await fetch("/api/salary-guide-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setIsOpen(false), 2000);
      }
    },
  });

  useEffect(() => {
    if (hasShown) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasShown(true);
    }, 9000);
    return () => clearTimeout(timer);
  }, [hasShown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg bg-card p-6 shadow-xl">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Free Download
          </span>
          <h2 className="mt-3 text-xl font-semibold text-foreground">Get Our 2026 Salary Guide</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Exclusive insights into salary benchmarks and employment trends for your industry.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="mt-3 font-semibold">Thank you!</p>
            <p className="text-sm text-muted-foreground">We&apos;ll send the guide to your email shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.AppForm>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.AppField name="fullName">
                  {(field) => <field.Input label="Full Name *" required />}
                </form.AppField>
                <form.AppField name="email">
                  {(field) => <field.Input label="Email *" type="email" required />}
                </form.AppField>
                <form.AppField name="mobileNumber">
                  {(field) => <field.Input label="Mobile *" required />}
                </form.AppField>

                <form.AppField name="department">
                  {(field) => (
                    <field.Select label="Department">
                      {DEPARTMENTS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>

                <form.AppField name="currentPosition">
                  {(field) => (
                    <field.Select label="Position / Level">
                      {POSITIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>

                <form.AppField name="industry">
                  {(field) => (
                    <field.Select label="Industry">
                      {INDUSTRIES.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>

                <form.AppField name="educationalQualification">
                  {(field) => (
                    <field.Select label="Educational Qualification" description="Select Academic">
                      {QUALIFICATIONS_ACADEMIC.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>

                <form.AppField name="professionalQualification">
                  {(field) => (
                    <field.Select label="Professional Qualification" description="Select Professional">
                      {QUALIFICATIONS_PROFESSIONAL.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>

                <form.AppField name="totalExperience">
                  {(field) => (
                    <field.Select label="Total Experience">
                      {EXPERIENCE_RANGES.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>

                <form.AppField name="availableFromDate">
                  {(field) => (
                    <field.Select label="Availability / Status">
                      {AVAILABILITY.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>

                <form.AppField name="currentOrganization">
                  {(field) => <field.Input label="Current Organization" />}
                </form.AppField>
                <form.AppField name="previousOrganizations">
                  {(field) => <field.Input label="Previous Organizations" />}
                </form.AppField>
                <form.AppField name="currentSalary">
                  {(field) => <field.Input label="Current Salary" />}
                </form.AppField>
                <form.AppField name="expectedSalary">
                  {(field) => <field.Input label="Expected Salary" />}
                </form.AppField>
              </div>

              <form.AppField name="location">
                {(field) => (
                  <field.Select label="Location *">
                    {LOCATIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </field.Select>
                )}
              </form.AppField>

              <form.AppField name="cvUrl">
                {(field) => <field.FileUpload label="Upload CV (PDF, DOC, DOCX — max 5MB)" />}
              </form.AppField>

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </form.AppForm>
          </form>
        )}
      </div>
    </div>
  );
}
