"use client";

import React, { useState } from "react";
import { useAppForm } from "@/hooks/use-field-context";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ApplyFormProps {
  jobId: string;
  jobTitle: string;
}

export function ApplyForm({ jobId, jobTitle }: ApplyFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      cvUrl: "",
      coverLetter: "",
      career: jobId,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (res.ok) {
          setSubmitted(true);
          toast.success("Application submitted successfully!");
        } else {
          toast.error("Failed to submit application. Please try again.");
        }
      } catch (error) {
        console.error("Application submission error:", error);
        toast.error("An error occurred. Please try again later.");
      }
    },
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Application Sent!</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-md">
          Thank you for applying for the <strong>{jobTitle}</strong> position. Our recruitment team will review your profile and get back to you soon.
        </p>
        <div className="mt-10 flex gap-4">
          <Button asChild>
            <Link href="/jobs">Browse More Jobs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl lg:p-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.AppForm>
          <div className="grid gap-6 sm:grid-cols-2">
            <form.AppField name="fullName">
              {(field: any) => <field.Input label="Full Name" required />}
            </form.AppField>
            <form.AppField name="email">
              {(field: any) => <field.Input label="Email Address" type="email" required />}
            </form.AppField>
          </div>

          <form.AppField name="phone">
            {(field: any) => <field.Input label="Phone Number" required />}
          </form.AppField>

          <form.AppField name="cvUrl">
            {(field: any) => <field.FileUpload label="Upload CV" required />}
          </form.AppField>

          <form.AppField name="coverLetter">
            {(field: any) => (
              <field.Textarea 
                label="Covering Letter" 
                placeholder="Tell us why you're a great fit for this role..." 
                rows={6} 
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state: any) => state.isSubmitting}>
            {(isSubmitting: any) => (
              <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  "Apply Now"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form.AppForm>
      </form>
    </div>
  );
}
