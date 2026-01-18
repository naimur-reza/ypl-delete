"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput, FormTextarea } from "./form";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

type JobApplicationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  expectedSalary?: string;
};

type JobApplicationFormProps = {
  careerId: string;
  careerTitle: string;
};

export function JobApplicationForm({ careerId, careerTitle }: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { control, handleSubmit, reset } = useForm<JobApplicationFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      coverLetter: "",
      linkedinUrl: "",
      portfolioUrl: "",
      currentCompany: "",
      yearsOfExperience: undefined,
      expectedSalary: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: JobApplicationFormData) => {
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real implementation, you would upload the resume to cloud storage first
      // For now, we'll just submit the form data
      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          careerId,
          resumeUrl: resumeFile.name, // In production, this would be the uploaded file URL
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      toast.success("Application submitted successfully! We'll review your application and get back to you soon.");
      reset();
      setResumeFile(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-2">Ready to Apply?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Join our team and make a difference in students' lives
        </p>
        <Button
          onClick={() => setShowForm(true)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Apply Now
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Apply for this Position</h3>
        <p className="text-sm text-muted-foreground">
          Fill out the form below to apply for {careerTitle}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="firstName"
            label="First Name"
            description="Your first name"
          />
          <FormInput
            control={control}
            name="lastName"
            label="Last Name"
            description="Your last name"
          />
        </div>

        <FormInput
          control={control}
          name="email"
          label="Email Address"
          description="We'll contact you here"
        />

        <FormInput
          control={control}
          name="phone"
          label="Phone Number"
          description="Include country code"
        />

        {/* Resume Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Resume/CV <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer bg-muted/30"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {resumeFile ? resumeFile.name : "Upload Resume (PDF or Word)"}
              </span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
        </div>

        <FormTextarea
          control={control}
          name="coverLetter"
          label="Cover Letter"
          description="Tell us why you're a great fit"
        />

        <FormInput
          control={control}
          name="linkedinUrl"
          label="LinkedIn Profile (Optional)"
          description="Your LinkedIn URL"
        />

        <FormInput
          control={control}
          name="portfolioUrl"
          label="Portfolio URL (Optional)"
          description="Link to your work"
        />

        <FormInput
          control={control}
          name="currentCompany"
          label="Current Company (Optional)"
          description="Where do you work now?"
        />

        <FormInput
          control={control}
          name="yearsOfExperience"
          label="Years of Experience (Optional)"
          description="Total years of experience"
        />

        <FormInput
          control={control}
          name="expectedSalary"
          label="Expected Salary (Optional)"
          description="Your salary expectations"
        />

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          By submitting this application, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
