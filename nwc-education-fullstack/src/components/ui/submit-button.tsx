"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  isUploading?: boolean;
  submitText?: string;
  submittingText?: string;
  uploadingText?: string;
}

export function SubmitButton({
  isSubmitting = false,
  isUploading = false,
  submitText = "Save",
  submittingText = "Saving...",
  uploadingText = "Uploading...",
  disabled,
  className,
  children,
  ...props
}: SubmitButtonProps) {
  const isDisabled = disabled || isSubmitting || isUploading;
  const isLoading = isSubmitting || isUploading;

  const getButtonText = () => {
    if (isUploading) return uploadingText;
    if (isSubmitting) return submittingText;
    return children || submitText;
  };

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className={cn("min-w-[100px]", className)}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {getButtonText()}
    </Button>
  );
}
