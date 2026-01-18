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

const schema = z.object({
  destinationId: z.string().min(1, "Destination is required"),
  intake: z
    .enum(["JANUARY", "MAY", "SEPTEMBER"])
    .describe("Intake is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  heroMedia: z.string().url().optional().nullable(),
  eligibility: z.string().optional().nullable(),
  timelineJson: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaUrl: z.string().url().optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
});

type FormData = z.infer<typeof schema>;

const api = createEntityApi<{ id: string }>("/api/intake-pages");

interface IntakePageFormProps {
  initialData?: { id: string } & Partial<FormData>;
  onSuccess?: () => void;
}

export function IntakePageForm({
  initialData,
  onSuccess,
}: IntakePageFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      try {
        const dRes = await apiClient.get<{
          data: { id: string; name: string }[];
        }>("/api/destinations", { limit: "1000" });
        if (dRes.data) {
          const arr = Array.isArray(dRes.data)
            ? (dRes.data as any)
            : (dRes.data as any).data || [];
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
      destinationId: initialData?.destinationId || "",
      intake: (initialData?.intake as any) || "JANUARY",
      title: initialData?.title || "",
      description: initialData?.description || "",
      heroMedia: initialData?.heroMedia || "",
      eligibility: initialData?.eligibility || "",
      timelineJson: initialData?.timelineJson
        ? JSON.stringify(initialData.timelineJson)
        : "",
      ctaLabel: initialData?.ctaLabel || "",
      ctaUrl: initialData?.ctaUrl || "",
      status: initialData?.status || "DRAFT",
    } as unknown as FormData,
    validators: { onSubmit: schema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const payload = {
          ...value,
          description: value.description || null,
          heroMedia: value.heroMedia || null,
          eligibility: value.eligibility || null,
          timelineJson: value.timelineJson
            ? JSON.parse(value.timelineJson)
            : null,
          ctaLabel: value.ctaLabel || null,
          ctaUrl: value.ctaUrl || null,
          status: value.status || "DRAFT",
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
          isEditing ? "Intake page updated" : "Intake page created"
        );
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/intake-pages"],
        });
        router.push("/dashboard/intake-pages");
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
        <form.AppField name="destinationId">
          {(field) => (
            <field.Select label="Destination">
              <SelectItem value="_value_">-- None --</SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="intake">
          {(field) => (
            <field.Select label="Review Type">
              <SelectItem value="JANUARY">January</SelectItem>
              <SelectItem value="MAY">May</SelectItem>
              <SelectItem value="SEPTEMBER">September</SelectItem>
            </field.Select>
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
        <form.AppField name="title">
          {(field) => <field.Input label="Title" />}
        </form.AppField>
        <form.AppField name="description">
          {(field) => <field.Textarea label="Description" />}
        </form.AppField>
        <form.AppField name="heroMedia">
          {(field) => <field.Input label="Hero Media URL" />}
        </form.AppField>
        <form.AppField name="eligibility">
          {(field) => <field.Textarea label="Eligibility" />}
        </form.AppField>
        <form.AppField name="timelineJson">
          {(field) => <field.Textarea label="Timeline JSON" />}
        </form.AppField>
        <form.AppField name="ctaLabel">
          {(field) => <field.Input label="CTA Label" />}
        </form.AppField>
        <form.AppField name="ctaUrl">
          {(field) => <field.Input label="CTA URL" />}
        </form.AppField>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/intake-pages")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <SubmitButton
            isSubmitting={isSubmitting}
            submitText={isEditing ? "Update" : "Create"}
            submittingText={isEditing ? "Updating..." : "Creating..."}
          />
        </div>
      </FieldGroup>
    </form>
  );
}
