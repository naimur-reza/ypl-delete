import { FormBase, FormControlProps } from "./FormBase";
import { useFieldContext } from "@/hooks/use-field-context";
import { Button } from "../ui/button";
import { Upload, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/api/upload";

export function FormImageUpload(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImage(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      const data = result.data as any;
      if (data.secure_url) {
        field.handleChange(data.secure_url);
        setError("");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setError(errorMessage);
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    field.handleChange("");
    setError("");
  };

  return (
    <FormBase {...props}>
      <div className="space-y-3">
        {field.state.value && (
          <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={field.state.value}
              alt="Preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
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
                {isLoading ? "Uploading..." : "Upload Image"}
              </span>
            </Button>
          </label>
        </div>
      </div>
    </FormBase>
  );
}
