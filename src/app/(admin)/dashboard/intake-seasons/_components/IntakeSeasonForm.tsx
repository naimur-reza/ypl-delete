/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
import { CountrySelect } from "@/components/ui/region-select";

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
  destinationId: z.string().optional().nullable(),
  isGlobal: z.boolean().optional().default(false),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
});

type FormData = z.infer<typeof schema>;

const api = createEntityApi<{ id: string }>("/api/intake-seasons");

interface IntakeSeasonFormProps {
  initialData?: { id: string } & Partial<FormData> & {
      countries?: { country: { id: string } }[];
      destination?: { id: string; name: string; slug: string } | null;
      isGlobal?: boolean;
    };
  onSuccess?: () => void;
}

export function IntakeSeasonForm({
  initialData,
  onSuccess,
}: IntakeSeasonFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [countries, setCountries] = useState<{ id: string; name: string }[]>(
    []
  );
  const [destinations, setDestinations] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGlobal, setIsGlobal] = useState<boolean>(
    initialData?.isGlobal ?? false
  );

  useEffect(() => {
    const load = async () => {
      try {
        const destinationsRes = await apiClient.get<{ data: { id: string; name: string; slug: string }[] }>("/api/destinations", { limit: "1000" });
        if (destinationsRes.data) {
          const arr = Array.isArray(destinationsRes.data)
            ? (destinationsRes.data as any)
            : (destinationsRes.data as any).data || [];
          setDestinations(arr);
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
        initialData?.countries?.map((c: any) => c.country?.id || c.countryId) ||
        [],
      destinationId:
        initialData?.destinationId ?? initialData?.destination?.id ?? "__none__",
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
          destinationId:
            value.destinationId === "__none__" || !value.destinationId
              ? null
              : value.destinationId,
          isGlobal: isGlobal,
          status: value.status || "DRAFT",
        } as Record<string, unknown>;

        const res =
          isEditing && initialData?.id
            ? await api.update(initialData.id, payload)
            : await api.create(payload);

        if (res.error) return toast.error(res.error);
        toast.success(
          isEditing ? "Intake season updated" : "Intake season created"
        );
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/intake-seasons"],
        });
        router.push("/dashboard/intake-management?tab=seasons");
        onSuccess?.();
      } catch (e) {
        toast.error("Request failed");
        console.error(e);
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
          {(field) => <field.Input label="Title" />}
        </form.AppField>

        <form.AppField name="subtitle">
          {(field) => <field.Input label="Subtitle" />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => <field.Textarea label="Description" />}
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
            {(field) => <field.Input label="Intake Start Date" type="date" />}
          </form.AppField>
        </div>

        <form.AppField name="destinationId">
          {(field) => (
            <field.Select label="Target destination (optional)">
              <SelectItem value="__none__">None</SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>

        <form.AppField name="countryIds">
          {(field) => (
            <CountrySelect
              label="Target Countries"
              value={field.state.value || []}
              onChange={field.handleChange}
              isGlobal={isGlobal}
              onGlobalChange={(checked) => {
                setIsGlobal(checked);
                if (checked) field.handleChange([]);
              }}
              showGlobalOption={true}
            />
          )}
        </form.AppField>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/intake-management?tab=seasons")}
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
