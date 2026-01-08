/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { useAppForm } from "@/hooks/hooks";
import { toast } from "sonner";
import z from "zod";
import { createRestEntityApi } from "@/lib/api-client";

const schema = z.object({
  author: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  content: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  countryId: z.string().optional().nullable(),
  destinationId: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

const api = createRestEntityApi<{ id: string }>("/api/gmb-reviews");

export default function ReviewFormModal({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<{ id: string; name: string }[]>(
    []
  );
  const [destinations, setDestinations] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, dRes] = await Promise.all([
          apiClient.get<{ data: { id: string; name: string }[] }>(
            "/api/countries",
            { limit: "1000" }
          ),
          apiClient.get<{ data: { id: string; name: string }[] }>(
            "/api/destinations",
            { limit: "1000" }
          ),
        ]);
        if (cRes.data) {
          const arr = Array.isArray(cRes.data)
            ? (cRes.data as any)
            : (cRes.data as any).data || [];
          setCountries(arr);
        }
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
      author: selected?.author || "",
      rating: (selected?.rating as number) || (0 as unknown as number),
      content: selected?.content || "",
      url: selected?.url || "",
      publishedAt: (selected?.publishedAt as string) || "",
      countryId: selected?.countryId || "",
      destinationId: selected?.destinationId || "",
    } as unknown as FormData,
    validators: { onSubmit: schema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const payload = {
          ...value,
          rating:
            typeof value.rating === "number" && value.rating > 0
              ? value.rating
              : null,
          content: value.content || null,
          url: value.url || null,
          publishedAt: value.publishedAt || null,
          countryId: value.countryId || null,
          destinationId: value.destinationId || null,
        } as Record<string, unknown>;

        const res =
          isEditing && selected?.id
            ? await api.update(selected.id, payload)
            : await api.create(payload);

        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success(isEditing ? "Review updated" : "Review created");
        onClose();
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
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Review" : "Add Review"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="author">
            {(field) => <field.Input label="Author" />}
          </form.AppField>
          <form.AppField name="rating">
            {(field) => <field.Input label="Rating (1-5)" />}
          </form.AppField>
          <form.AppField name="content">
            {(field) => <field.Textarea label="Content" />}
          </form.AppField>
          <form.AppField name="url">
            {(field) => <field.Input label="URL" />}
          </form.AppField>
          <form.AppField name="publishedAt">
            {(field) => <field.Input label="Published At (YYYY-MM-DD)" />}
          </form.AppField>
          <div className="space-y-2">
            <label className="text-sm font-medium">Country (optional)</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={(form.getFieldValue("countryId") as string) || ""}
              onChange={(e) =>
                form.setFieldValue("countryId", e.target.value || "")
              }
            >
              <option value="">-- None --</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Destination (optional)
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={(form.getFieldValue("destinationId") as string) || ""}
              onChange={(e) =>
                form.setFieldValue("destinationId", e.target.value || "")
              }
            >
              <option value="">-- None --</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
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
              submitText={isEditing ? "Update" : "Create"}
              submittingText={isEditing ? "Updating..." : "Creating..."}
            />
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
}
