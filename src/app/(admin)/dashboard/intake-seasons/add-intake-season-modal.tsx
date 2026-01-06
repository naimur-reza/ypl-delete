/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";
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
  isActive: z.boolean().default(false),
  applicationDeadline: z.string().optional().nullable(),
  intakeStartDate: z.string().optional().nullable(),
  countryIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const api = createEntityApi<{ id: string }>("/api/intake-seasons");

export default function IntakeSeasonFormModal({
  isEditing,
  selected,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selected?: { id: string } & Partial<FormData> & {
    countries?: { country: { id: string } }[];
  };
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const isOpen = true;
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get<{ data: { id: string; name: string }[] }>(
          "/api/countries",
          { limit: "1000" }
        );
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
      title: selected?.title || "",
      subtitle: selected?.subtitle || "",
      description: selected?.description || "",
      intake: (selected?.intake as any) || "JANUARY",
      year: selected?.year || new Date().getFullYear(),
      backgroundImage: selected?.backgroundImage || "",
      ctaLabel: selected?.ctaLabel || "Apply Now",
      ctaUrl: selected?.ctaUrl || "/apply-now",
      isActive: selected?.isActive || false,
      applicationDeadline: selected?.applicationDeadline
        ? new Date(selected.applicationDeadline).toISOString().split("T")[0]
        : "",
      intakeStartDate: selected?.intakeStartDate
        ? new Date(selected.intakeStartDate).toISOString().split("T")[0]
        : "",
      countryIds:
        selected?.countries?.map((c: any) => c.country?.id || c.countryId) || [],
    } as unknown as FormData,
    validators: { onSubmit: schema as any },
    onSubmit: async ({ value }) => {
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
        } as Record<string, unknown>;

        const res =
          isEditing && selected?.id
            ? await api.update(selected.id, payload)
            : await api.create(payload);

        if (res.error) return toast.error(res.error);
        toast.success(
          isEditing ? "Intake season updated" : "Intake season created"
        );
        onClose();
        onSuccess?.();
      } catch (e) {
        toast.error("Request failed");
        console.error(e);
      }
    },
  });

  const countryOptions = countries.map((c) => ({ value: c.id, label: c.name }));

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Intake Season" : "Add Intake Season"}
      onClose={onClose}
    >
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
                placeholder="e.g., January 2026 Intake - Admission open!"
              />
            )}
          </form.AppField>

          <form.AppField name="subtitle">
            {(field) => (
              <field.Input
                label="Subtitle"
                placeholder="e.g., Study in the UK at Top Universities"
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.Textarea
                label="Description"
                placeholder="e.g., Apply early to secure your place!"
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

          <form.AppField name="backgroundImage">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Image</label>
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
              {(field) => <field.Input label="Application Deadline" type="date" />}
            </form.AppField>

            <form.AppField name="intakeStartDate">
              {(field) => <field.Input label="Intake Start Date" type="date" />}
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

          <form.AppField name="isActive">
            {(field) => (
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={field.state.value || false}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="h-5 w-5"
                />
                <div>
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Set as Active Season
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Only one intake season can be active at a time. This will be
                    displayed on the website.
                  </p>
                </div>
              </div>
            )}
          </form.AppField>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
}
