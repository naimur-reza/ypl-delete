"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { CountrySelect } from "@/components/ui/region-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";
import { Switch } from "@/components/ui/switch";

const galleryTypeOptions = [
  { value: "VISA_SUCCESS", label: "Visa Success" },
  { value: "REPRESENTATIVE", label: "Representative" },
  { value: "EVENT", label: "Event" },
  { value: "OFFICE", label: "Office" },
  { value: "STUDENT", label: "Student" },
];

const gallerySchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().optional().nullable(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  type: z
    .enum(["VISA_SUCCESS", "REPRESENTATIVE", "EVENT", "OFFICE", "STUDENT"])
    .default("VISA_SUCCESS"),
  sortOrder: z.number().int().optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]),
  countryIds: z.array(z.string()).optional(),
  countries: z.array(z.object({})).optional(),
});

type FormData = z.infer<typeof gallerySchema>;

const api = createEntityApi<{ id: string }>("/api/gallery");

interface GalleryFormProps {
  initialData?: { id: string } & Partial<FormData>;
  onSuccess?: () => void;
}

export function GalleryForm({ initialData, onSuccess }: GalleryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [countryIds, setCountryIds] = useState<string[]>(
    (
      initialData?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || ""
      ) || []
    ).filter((id) => id !== "")
  );

  const [typeValue, setTypeValue] = useState<string>(
    initialData?.type || "VISA_SUCCESS"
  );
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT">(
    initialData?.status || "DRAFT"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(
    initialData?.image ? [initialData.image] : []
  );

  const form = useAppForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      images: initialData?.image ? [initialData.image] : [],
      type: initialData?.type || "VISA_SUCCESS",
      sortOrder: initialData?.sortOrder ?? null,
      status: initialData?.status || "DRAFT",
      countryIds: initialData?.countryIds ?? [],
    } as unknown as FormData,
    validators: { onSubmit: gallerySchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        if (!isEditing && images.length === 0) {
          toast.error("Please upload at least one image");
          return;
        }

        if (isEditing && initialData?.id) {
          const payload = {
            ...value,
            image: images[0] || value.image,
            description: value.description || null,
            sortOrder:
              typeof value.sortOrder === "number" ? value.sortOrder : null,
            status,
            countryIds,
          } as Record<string, unknown>;

          const res = await api.update(initialData.id, payload);
          if (res.error) return toast.error(res.error);
          toast.success("Gallery item updated");
        } else {
          const basePayload = {
            title: value.title,
            description: value.description || null,
            type: typeValue,
            sortOrder:
              typeof value.sortOrder === "number" ? value.sortOrder : null,
            status,
            countryIds,
          };

          const results = await Promise.all(
            images.map((imageUrl, index) =>
              api.create({
                ...basePayload,
                image: imageUrl,
                title:
                  images.length > 1
                    ? `${value.title} (${index + 1})`
                    : value.title,
              })
            )
          );

          const errors = results.filter((r) => r.error);
          if (errors.length > 0) {
            toast.error(`${errors.length} items failed to create`);
            return;
          }
          toast.success(`${images.length} gallery item(s) created`);
        }

        router.push("/dashboard/gallery");
        onSuccess?.();
        setCountryIds([]);
        setImages([]);
      } catch (e) {
        toast.error("Request failed");
        console.error(e);
        setCountryIds([]);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="title">
          {(field) => (
            <field.Input
              label={
                isEditing ? "Title" : "Title (Base name for multiple images)"
              }
            />
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => <field.Textarea label="Description (Optional)" />}
        </form.AppField>

        {isEditing ? (
          <form.AppField name="image">
            {(field) => (
              <div className="space-y-4">
                <ImageUpload
                  value={images[0] || field.state.value || ""}
                  onChange={(url) => {
                    field.handleChange(url || "");
                    setImages(url ? [url] : []);
                  }}
                  label="Upload Image"
                  folder="gallery"
                  onUploadingChange={setIsUploading}
                />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or enter URL
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <input
                    id="imageUrl"
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                    value={images[0] || field.state.value || ""}
                    onChange={(e) => {
                      field.handleChange(e.target.value || "");
                      setImages(e.target.value ? [e.target.value] : []);
                    }}
                  />
                </div>
              </div>
            )}
          </form.AppField>
        ) : (
          <div className="space-y-2">
            <MultipleImageUpload
              value={images}
              onChange={setImages}
              label="Upload Images (Multiple allowed)"
              folder="gallery"
              maxImages={20}
              onUploadingChange={setIsUploading}
            />
            <p className="text-xs text-muted-foreground">
              Each image will create a separate gallery item with the same
              metadata.
            </p>
          </div>
        )}

        <form.AppField name="type">
          {(field) => (
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={typeValue}
                onValueChange={(val) => {
                  setTypeValue(val);
                  field.handleChange(val as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {galleryTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.AppField>
        <form.AppField name="sortOrder">
          {(field) => <field.Input label="Sort Order" type="number" />}
        </form.AppField>
        <form.AppField name="countryIds">
          {(field) => (
            <CountrySelect
              value={countryIds}
              onChange={(ids) => {
                setCountryIds(ids);
                field.handleChange(ids);
              }}
              label="Select Countries (Optional)"
            />
          )}
        </form.AppField>

        <form.AppField name="status">
          {(field) => (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(val) => {
                  setStatus(val as "ACTIVE" | "DRAFT");
                  field.handleChange(val as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.AppField>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/gallery")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <SubmitButton
            isSubmitting={isSubmitting}
            isUploading={isUploading}
            submitText={
              isEditing
                ? "Update"
                : `Create${images.length > 1 ? ` (${images.length} items)` : ""}`
            }
            submittingText={isEditing ? "Updating..." : "Creating..."}
          />
        </div>
      </FieldGroup>
    </form>
  );
}

