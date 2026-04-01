"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-field-context";
import { toast } from "sonner";
import Link from "next/link";

/* ───────── Option lists ───────── */
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

const QUALIFICATIONS_ACADEMIC = ["BBA / MBA", "BSc / MSc"];

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

const AVAILABILITY = ["Immediate", "15 Days", "1 Month+"];

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

type StepId = 1 | 2 | 3;

const STEP_LABELS: { id: StepId; title: string; description: string }[] = [
  {
    id: 1,
    title: "Basic details",
    description: "Tell us who you are and how to reach you.",
  },
  {
    id: 2,
    title: "Career focus",
    description: "Share your target department, role, and experience.",
  },
  {
    id: 3,
    title: "Compensation & CV",
    description: "Add current packages, expectations, and upload your CV.",
  },
];

export function CVSubmissionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);
  const [step, setStep] = useState<StepId>(1);

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
      role: "",
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
      try {
        const res = await fetch("/api/salary-guide-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (res.ok) {
          setSubmitted(true);
          toast.success("Profile submitted successfully!");
        } else {
          toast.error("Failed to submit profile. Please try again.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  const goToNext = () => {
    setStep((prev) => (prev < 3 ? ((prev + 1) as StepId) : prev));
  };

  const goToPrev = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as StepId) : prev));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle className="h-16 w-16 text-primary mb-6" />
        <h2 className="text-3xl font-bold text-foreground">Registration Complete!</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
          Your profile has been added to our elite CV Bank. Our consultants will reach out when a role truly fits your experience and ambition.
        </p>
        <div className="mt-10">
          <Button asChild>
            <Link href="/jobs">Browse Current Openings</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentStepMeta = STEP_LABELS.find((s) => s.id === step)!;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl lg:p-10">
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Step {step} of {STEP_LABELS.length}
            </p>
            <h2 className="text-xl font-bold text-foreground">
              {currentStepMeta.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {currentStepMeta.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {STEP_LABELS.map((s) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            return (
              <div
                key={s.id}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  isCompleted
                    ? "bg-primary"
                    : isActive
                      ? "bg-primary/70"
                      : "bg-muted"
                }`}
              />
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (step < 3) {
            goToNext();
          } else {
            form.handleSubmit();
          }
        }}
        className="space-y-6"
      >
        <form.AppForm>
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="grid gap-6 sm:grid-cols-2">
                <form.AppField name="fullName">
                  {(field: any) => <field.Input label="Full Name *" required />}
                </form.AppField>
                <form.AppField name="email">
                  {(field: any) => (
                    <field.Input label="Email Address *" type="email" required />
                  )}
                </form.AppField>
                <form.AppField name="mobileNumber">
                  {(field: any) => (
                    <field.Input label="Mobile Number *" required />
                  )}
                </form.AppField>
                <form.AppField name="location">
                  {(field: any) => (
                    <field.Select label="Preferred Location *">
                      {LOCATIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="grid gap-6 sm:grid-cols-2">
                <form.AppField name="department">
                  {(field: any) => (
                    <field.Select
                      label="Primary Department"
                      onValueChange={(val: string) => {
                        form.setFieldValue("role", "");
                        const dept = departments.find((d) => d.name === val);
                        if (dept) {
                          fetch(`/api/roles?departmentId=${dept._id}`)
                            .then((res) => res.json())
                            .then((data) => setRoles(data))
                            .catch((err) =>
                              console.error("Error fetching roles:", err),
                            );
                        } else {
                          setRoles([]);
                        }
                      }}
                    >
                      {departments.map((opt) => (
                        <SelectItem key={opt._id} value={opt.name}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>
                <form.Subscribe selector={(state: any) => state.values.department}>
                  {(deptName: string) => (
                    <form.AppField name="role">
                      {(field: any) => (
                        <field.Select
                          label="Specific Role"
                          disabled={!deptName}
                        >
                          {roles.map((opt) => (
                            <SelectItem key={opt._id} value={opt.name}>
                              {opt.name}
                            </SelectItem>
                          ))}
                        </field.Select>
                      )}
                    </form.AppField>
                  )}
                </form.Subscribe>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <form.AppField name="currentPosition">
                  {(field: any) => (
                    <field.Select label="Position Level">
                      {POSITIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>
                <form.AppField name="industry">
                  {(field: any) => (
                    <field.Select label="Target Industry">
                      {INDUSTRIES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <form.AppField name="totalExperience">
                  {(field: any) => (
                    <field.Select label="Total Experience">
                      {EXPERIENCE_RANGES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>
                <form.AppField name="educationalQualification">
                  {(field: any) => (
                    <field.Select label="Academic Qualification">
                      {QUALIFICATIONS_ACADEMIC.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>
                <form.AppField name="professionalQualification">
                  {(field: any) => (
                    <field.Select label="Professional Qualification">
                      {QUALIFICATIONS_PROFESSIONAL.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
              <div className="grid gap-6 sm:grid-cols-2">
                <form.AppField name="currentOrganization">
                  {(field: any) => <field.Input label="Current Company" />}
                </form.AppField>
                <form.AppField name="availableFromDate">
                  {(field: any) => (
                    <field.Select label="Notice Period / Availability">
                      {AVAILABILITY.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </field.Select>
                  )}
                </form.AppField>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <form.AppField name="currentSalary">
                  {(field: any) => (
                    <field.Input label="Current Salary (Monthly)" />
                  )}
                </form.AppField>
                <form.AppField name="expectedSalary">
                  {(field: any) => (
                    <field.Input label="Expected Salary (Monthly)" />
                  )}
                </form.AppField>
              </div>

              <form.AppField name="cvUrl">
                {(field: any) => (
                  <field.FileUpload label="Upload CV (PDF preferred)" required />
                )}
              </form.AppField>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={goToPrev}
              disabled={step === 1}
              className="text-xs"
            >
              Back
            </Button>

            <form.Subscribe selector={(state: any) => state.isSubmitting}>
              {(isSubmitting: any) => (
                <Button
                  type="submit"
                  className="h-10 px-6 text-sm font-semibold"
                  disabled={isSubmitting}
                >
                  {step < 3 ? (
                    "Continue"
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit profile"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form.AppForm>
      </form>
    </div>
  );
}
