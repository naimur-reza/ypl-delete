/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { CountrySelect } from "@/components/ui/region-select";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";

const accreditationTypeOptions = [
  { value: "NEWS", label: "As Seen in News" },
  { value: "PARTNER", label: "University Partner" },
  { value: "ACCREDITATION", label: "Accreditation" },
];

const accreditationSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  logo: z.string().optional().nullable(),
  website: z
    .union([z.string().url(), z.literal(""), z.null()])
    .optional()
    .nullable(),
  type: z.enum(["NEWS", "PARTNER", "ACCREDITATION"]).default("NEWS"),
  sortOrder: z.number().int().optional().nullable(),
  countryIds: z.array(z.string().min(1)).min(1, "Select at least one country"),
  countries: z.array(z.object()).optional(),
});

type FormData = z.infer<typeof accreditationSchema>;

const api = createEntityApi<{ id: string }>("/api/accreditations");

export default function AccreditationFormModal({
  isEditing,
  selected,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selected?: { id: string } & Partial<FormData>;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const isOpen = true;

  const [countryIds, setCountryIds] = useState<string[]>(
    (
      selected?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || ""
      ) || []
    ).filter((id) => id !== "")
  );

  const [typeValue, setTypeValue] = useState<string>(selected?.type || "NEWS");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm({
    defaultValues: {
      name: selected?.name || "",
      logo: selected?.logo || "",
      website: selected?.website || "",
      type: selected?.type || "NEWS",
      sortOrder: selected?.sortOrder ?? null,
      countryIds:
        countryIds.length > 0 ? countryIds : selected?.countryIds ?? [],
    } as unknown as FormData,
    validators: { onSubmit: accreditationSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // Ensure countryIds from state is used
        const finalCountryIds =
          countryIds.length > 0 ? countryIds : value.countryIds || [];

        const payload = {
          ...value,
          countryIds: finalCountryIds,
          logo: value.logo || null,
          website:
            value.website && value.website.trim() !== "" ? value.website : null,
          sortOrder:
            typeof value.sortOrder === "number" ? value.sortOrder : null,
        } as Record<string, unknown>;

        const res =
          isEditing && selected?.id
            ? await api.update(selected.id, payload)
            : await api.create(payload);

        if (res.error) {
          toast.error(res.error);
          return;
        }

        toast.success(
          isEditing ? "Accreditation updated" : "Accreditation created"
        );
        onClose();
        onSuccess?.();
        setCountryIds([]);
      } catch (e: any) {
        // Handle Zod validation errors
        if (e?.issues && Array.isArray(e.issues)) {
          const firstError = e.issues[0];
          toast.error(firstError.message || "Validation error");
          return;
        }

        toast.error("Request failed");
        console.error(e);
        setCountryIds([]);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Sync countryIds when selected changes
  useEffect(() => {
    if (selected?.countries) {
      const ids = selected.countries
        .map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || ""
        )
        .filter((id: string) => id !== "");
      setCountryIds(ids);
      form.setFieldValue("countryIds", ids);
    }
  }, [selected, form]);

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Accreditation" : "Add Accreditation"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="name">
            {(field) => <field.Input label="Name" />}
          </form.AppField>
          <form.AppField name="logo">
            {(field) => (
              <div className="space-y-4">
                <ImageUpload
                  value={field.state.value || ""}
                  onChange={(url) => field.handleChange(url || null)}
                  label="Upload Logo"
                  folder="accreditations"
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
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <input
                    id="logoUrl"
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/logo.png"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value || null)}
                  />
                </div>
              </div>
            )}
          </form.AppField>
          <form.AppField name="website">
            {(field) => <field.Input label="Website URL" />}
          </form.AppField>
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
                    {accreditationTypeOptions.map((opt) => (
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
                label="Select Countries"
              />
            )}
          </form.AppField>
          {form.state.errors && form.state.errors.length > 0 && (
            <p className="text-sm text-red-500 mt-1">
              {form.state.errors.find((e: any) => e?.name === "countryIds")
                ?.message || "Please select at least one country"}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <SubmitButton
              isSubmitting={isSubmitting}
              isUploading={isUploading}
              submitText={isEditing ? "Update" : "Create"}
              submittingText={isEditing ? "Updating..." : "Creating..."}
            />
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
}
