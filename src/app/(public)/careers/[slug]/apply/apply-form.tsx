"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle2, FileText, X } from "lucide-react";

type ApplyFormData = {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  linkedinUrl?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
};

type ApplyFormProps = {
  careerId: string;
  careerTitle: string;
};

export function ApplyForm({ careerId, careerTitle }: ApplyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyFormData>();

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload-resume", {
          method: "POST",
          body: formData,
        });
        if (!response.ok)
          throw new Error((await response.json()).error || "Failed to upload");
        const data = await response.json();
        setResumeFile({ name: file.name, url: data.url });
        toast.success("Resume uploaded");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const onSubmit = async (data: ApplyFormData) => {
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          careerId,
          resumeUrl: resumeFile.url,
          yearsOfExperience: data.yearsOfExperience
            ? Number(data.yearsOfExperience)
            : null,
        }),
      });
      if (!response.ok)
        throw new Error((await response.json()).error || "Failed to submit");
      setIsSuccess(true);
      reset();
      setResumeFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Thank you for applying for <strong>{careerTitle}</strong>. We'll be in
          touch soon.
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/careers")}
          >
            View Other Jobs
          </Button>
          <Button size="sm" onClick={() => setIsSuccess(false)}>
            Apply Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <Label htmlFor="name" className="text-sm">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name", { required: "Required" })}
            className={`mt-1 h-9 ${errors.name ? "border-destructive" : ""}`}
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email", {
              required: "Required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid",
              },
            })}
            className={`mt-1 h-9 ${errors.email ? "border-destructive" : ""}`}
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 555-123-4567"
            {...register("phone", { required: "Required" })}
            className={`mt-1 h-9 ${errors.phone ? "border-destructive" : ""}`}
          />
        </div>
      </div>

      {/* Resume */}
      <div>
        <Label className="text-sm">
          Resume/CV <span className="text-destructive">*</span>
        </Label>
        {resumeFile ? (
          <div className="mt-1 flex items-center justify-between p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm truncate max-w-[200px]">
                {resumeFile.name}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setResumeFile(null)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : (
          <label
            className={`mt-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isUploading
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <Upload className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Upload PDF or Word (max 10MB)"}
            </span>
          </label>
        )}
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="currentCompany" className="text-sm">
            Current Company
          </Label>
          <Input
            id="currentCompany"
            placeholder="Company name"
            {...register("currentCompany")}
            className="mt-1 h-9"
          />
        </div>
        <div>
          <Label htmlFor="yearsOfExperience" className="text-sm">
            Experience (years)
          </Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            placeholder="5"
            {...register("yearsOfExperience")}
            className="mt-1 h-9"
          />
        </div>
        <div>
          <Label htmlFor="linkedinUrl" className="text-sm">
            LinkedIn
          </Label>
          <Input
            id="linkedinUrl"
            type="url"
            placeholder="linkedin.com/in/..."
            {...register("linkedinUrl")}
            className="mt-1 h-9"
          />
        </div>
      </div>

      {/* Cover Letter */}
      <div>
        <Label htmlFor="coverLetter" className="text-sm">
          Cover Letter (optional)
        </Label>
        <Textarea
          id="coverLetter"
          placeholder="Why are you interested in this role?"
          rows={3}
          {...register("coverLetter")}
          className="mt-1"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || !resumeFile}
        className="w-full"
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
    </form>
  );
}
