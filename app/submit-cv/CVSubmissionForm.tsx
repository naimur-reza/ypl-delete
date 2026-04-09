"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/use-field-context";
import { useDepartmentsAndRoles } from "@/hooks/use-departments-and-roles";
import { toast } from "sonner";
import Link from "next/link";
import { CVStepBasic } from "@/components/submit-cv/cv-step-basic";
import { CVStepCareer } from "@/components/submit-cv/cv-step-career";
import { CVStepCompensation } from "@/components/submit-cv/cv-step-compensation";

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
  const [step, setStep] = useState<StepId>(1);
  const { departments, roles, onDepartmentNameChange } = useDepartmentsAndRoles();

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
            <h2 className="text-xl font-bold text-foreground">{currentStepMeta.title}</h2>
            <p className="text-xs text-muted-foreground">{currentStepMeta.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {STEP_LABELS.map((s) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            return (
              <div key={s.id} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    isCompleted ? "bg-primary" : isActive ? "bg-primary/70" : "bg-muted"
                  }`}
                />
                <p
                  className={`mt-1 text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {s.title}
                </p>
              </div>
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
          {step === 1 && <CVStepBasic form={form as any} />}
          {step === 2 && (
            <CVStepCareer
              form={form as any}
              departments={departments}
              roles={roles}
              onDepartmentNameChange={onDepartmentNameChange}
            />
          )}
          {step === 3 && <CVStepCompensation form={form as any} />}

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
