/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
  sortOrder: z.number().int().optional().nullable(),
  countryIds: z.array(z.string().min(1)).min(1, "Select at least one country"),
  countries: z.array(z.object()).optional(),
});

type FormData = z.infer<typeof accreditationSchema>;

const api = createEntityApi<{ id: string }>("/api/accreditations");

interface AccreditationFormProps {
  initialData?: { id: string } & Partial<FormData>;
  onSuccess?: () => void;
}

export function AccreditationForm({
  initialData,
  onSuccess,
}: AccreditationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
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
    initialData?.type || "NEWS"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm({
    defaultValues: {
      name: initialData?.name || "",
      logo: initialData?.logo || "",
      website: initialData?.website || "",
      type: initialData?.type || "NEWS",
      status: initialData?.status || "DRAFT",
      sortOrder: initialData?.sortOrder ?? null,
      countryIds:
        countryIds.length > 0 ? countryIds : initialData?.countryIds ?? [],
    } as unknown as FormData,
    validators: { onSubmit: accreditationSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
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
          isEditing && initialData?.id
            ? await api.update(initialData.id, payload)
            : await api.create(payload);

        if (res.error) {
          toast.error(res.error);
          return;
        }

        toast.success(
          isEditing ? "Accreditation updated" : "Accreditation created"
        );
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/accreditations"],
        });
        router.push("/dashboard/accreditations");
        onSuccess?.();
        setCountryIds([]);
      } catch (e: any) {
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

  useEffect(() => {
    if (initialData?.countries) {
      const ids = initialData.countries
        .map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || ""
        )
        .filter((id: string) => id !== "");
      setCountryIds(ids);
      form.setFieldValue("countryIds", ids);
    }
  }, [initialData, form]);

  return (
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
        <form.AppField name="status">
          {(field) => (
            <field.Select label="Status">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </field.Select>
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
            onClick={() => router.push("/dashboard/accreditations")}
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
  );
}
