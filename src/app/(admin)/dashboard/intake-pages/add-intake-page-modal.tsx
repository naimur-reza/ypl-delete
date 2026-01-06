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
});

type FormData = z.infer<typeof schema>;

const api = createEntityApi<{ id: string }>("/api/intake-pages");

export default function IntakePageFormModal({
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
      destinationId: selected?.destinationId || "",
      intake: (selected?.intake as any) || "JANUARY",
      title: selected?.title || "",
      description: selected?.description || "",
      heroMedia: selected?.heroMedia || "",
      eligibility: selected?.eligibility || "",
      timelineJson: selected?.timelineJson
        ? JSON.stringify(selected.timelineJson)
        : "",
      ctaLabel: selected?.ctaLabel || "",
      ctaUrl: selected?.ctaUrl || "",
    } as unknown as FormData,
    validators: { onSubmit: schema as any },
    onSubmit: async ({ value }) => {
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
        } as Record<string, unknown>;

        const res =
          isEditing && selected?.id
            ? await api.update(selected.id, payload)
            : await api.create(payload);

        if (res.error) return toast.error(res.error);
        toast.success(
          isEditing ? "Intake page updated" : "Intake page created"
        );
        onClose();
        onSuccess?.();
      } catch (e) {
        toast.error("Request failed");
        console.error(e);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Intake Page" : "Add Intake Page"}
      onClose={onClose}
    >
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
}
