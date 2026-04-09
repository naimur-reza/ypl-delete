import { FormBase, FormControlProps } from "./FormBase";
import { useFieldContext } from "@/hooks/use-field-context";
import { Button } from "../ui/button";
import { Upload, X, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";
import { uploadFile } from "@/app/api/upload";

const ACCEPTED_TYPES = ".pdf,.doc,.docx";
const MAX_SIZE_MB = 5;

export function FormFileUpload(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid file (PDF, DOC, or DOCX)");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_SIZE_MB}MB`);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadFile(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      const data = result.data as { secure_url?: string; url?: string };
      const uploadedUrl = data.secure_url || data.url;
      if (uploadedUrl) {
        const normalizedUrl = (() => {
          try {
            return new URL(uploadedUrl).toString();
          } catch {
            return uploadedUrl;
          }
        })();
        field.handleChange(normalizedUrl);
        setFileName(file.name);
        setError("");
      } else {
        throw new Error("Upload succeeded but no file URL was returned");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      console.error("Upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    field.handleChange("");
    setFileName("");
    setError("");
  };

  return (
    <FormBase {...props}>
      <div className="space-y-3">
        {field.state.value && (
          <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 text-gray-500 shrink-0" />
                <span className="text-sm truncate">{fileName || "CV uploaded"}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <a
              href={field.state.value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline break-all"
            >
              {field.state.value}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        <div className="relative">
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFileUpload}
            disabled={isLoading}
            id={field.name}
            onBlur={field.handleBlur}
            className="hidden"
            aria-invalid={isInvalid}
          />
          <label htmlFor={field.name}>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-200 cursor-pointer"
              disabled={isLoading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? "Uploading..." : "Upload CV (PDF, DOC, DOCX — max 5MB)"}
              </span>
            </Button>
          </label>
        </div>
      </div>
    </FormBase>
  );
}
