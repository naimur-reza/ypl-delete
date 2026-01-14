/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { apiClient } from "@/lib/api-client";
import { useAppForm } from "@/hooks/hooks";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { SelectItem } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import MultiSelect from "@/components/ui/multi-select";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  intake: z.enum(["JANUARY", "MAY", "SEPTEMBER"]),
  year: z.coerce.number().min(2020).max(2100),
  backgroundImage: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaUrl: z.string().optional().nullable(),
  applicationDeadline: z.string().optional().nullable(),
  intakeStartDate: z.string().optional().nullable(),
  countryIds: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
});

type FormData = z.infer<typeof schema>;

const api = createEntityApi<{ id: string }>("/api/intake-seasons");

interface IntakeSeasonFormProps {
  initialData?: { id: string } & Partial<FormData> & {
      countries?: { country: { id: string } }[];
    };
  onSuccess?: () => void;
}

export function IntakeSeasonForm({
  initialData,
  onSuccess,
}: IntakeSeasonFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [countries, setCountries] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get<{
          data: { id: string; name: string }[];
        }>("/api/countries", { limit: "1000" });
        if (res.data) {
          const arr = Array.isArray(res.data)
            ? (res.data as any)
            : (res.data as any).data || [];
          setCountries(arr);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const form = useAppForm({
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      description: initialData?.description || "",
      intake: (initialData?.intake as any) || "JANUARY",
      year: initialData?.year || new Date().getFullYear(),
      backgroundImage: initialData?.backgroundImage || "",
      ctaLabel: initialData?.ctaLabel || "Apply Now",
      ctaUrl: initialData?.ctaUrl || "/apply-now",
      applicationDeadline: initialData?.applicationDeadline
        ? new Date(initialData.applicationDeadline).toISOString().split("T")[0]
        : "",
      intakeStartDate: initialData?.intakeStartDate
        ? new Date(initialData.intakeStartDate).toISOString().split("T")[0]
        : "",
      countryIds:
        initialData?.countries?.map(
          (c: any) => c.country?.id || c.countryId
        ) || [],
      status: initialData?.status || "DRAFT",
    } as unknown as FormData,
    validators: { onSubmit: schema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const payload = {
          ...value,
          subtitle: value.subtitle || null,
          description: value.description || null,
          backgroundImage: value.backgroundImage || null,
          ctaLabel: value.ctaLabel || null,
          ctaUrl: value.ctaUrl || null,
          applicationDeadline: value.applicationDeadline || null,
          intakeStartDate: value.intakeStartDate || null,
          status: value.status || "DRAFT",
        } as Record<string, unknown>;

        const res = isEditing && initialData?.id
          ? await api.update(initialData.id, payload)
          : await api.create(payload);

        if (res.error) return toast.error(res.error);
        toast.success(
          isEditing ? "Intake season updated" : "Intake season created"
        );
        router.push("/dashboard/intake-seasons");
        onSuccess?.();
      } catch (e) {
        toast.error("Request failed");
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const countryOptions = countries.map((c) => ({
    value: c.id,
    label: c.name,
  }));

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
              label="Title"
 
            />
          )}
        </form.AppField>

        <form.AppField name="subtitle">
          {(field) => (
            <field.Input
              label="Subtitle"
     
            />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <field.Textarea
              label="Description"
            
            />
          )}
        </form.AppField>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="intake">
            {(field) => (
              <field.Select label="Intake Month">
                <SelectItem value="JANUARY">January</SelectItem>
                <SelectItem value="MAY">May</SelectItem>
                <SelectItem value="SEPTEMBER">September</SelectItem>
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="year">
            {(field) => (
              <field.Input label="Year" type="number" placeholder="2026" />
            )}
          </form.AppField>
        </div>

        <form.AppField name="status">
          {(field) => (
            <field.Select label="Status">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </field.Select>
          )}
        </form.AppField>

        <form.AppField name="backgroundImage">
          {(field) => (
            <div className="space-y-2">
         
              <ImageUpload
                value={field.state.value || ""}
                onChange={field.handleChange}
                onUploadingChange={setIsUploading}
              />
            </div>
          )}
        </form.AppField>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="ctaLabel">
            {(field) => (
              <field.Input label="CTA Label" placeholder="Apply Now" />
            )}
          </form.AppField>

          <form.AppField name="ctaUrl">
            {(field) => (
              <field.Input label="CTA URL" placeholder="/apply-now" />
            )}
          </form.AppField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="applicationDeadline">
            {(field) => (
              <field.Input label="Application Deadline" type="date" />
            )}
          </form.AppField>

          <form.AppField name="intakeStartDate">
            {(field) => (
              <field.Input label="Intake Start Date" type="date" />
            )}
          </form.AppField>
        </div>

        <form.AppField name="countryIds">
          {(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Target Countries (optional)
              </label>
              <MultiSelect
                options={countryOptions}
                value={field.state.value || []}
                onChange={field.handleChange}
                placeholder="Select countries..."
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to show for all countries
              </p>
            </div>
          )}
        </form.AppField>


        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/intake-seasons")}
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

