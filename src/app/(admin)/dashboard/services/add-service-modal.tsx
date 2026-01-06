/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState } from "react";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  slug: z.string().min(1, "Slug is required").max(150),
  summary: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
});

type FormData = z.infer<typeof serviceSchema>;

const serviceApi = createEntityApi<{ id: string }>("/api/services");

export default function ServiceFormModal({
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

  const [imageUrl, setImageUrl] = useState<string>(selected?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useAppForm({
    defaultValues: {
      title: selected?.title || "",
      slug: selected?.slug || "",
      summary: selected?.summary || "",
      content: selected?.content || "",
      image: selected?.image || "",
      metaTitle: selected?.metaTitle || "",
      metaDescription: selected?.metaDescription || "",
      metaKeywords: selected?.metaKeywords || "",
    } as FormData,
    validators: { onSubmit: serviceSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const payload = {
          ...value,
          summary: value.summary || null,
          content: value.content || null,
          image: imageUrl || null,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
        } as Record<string, unknown>;

        const res =
          isEditing && selected?.id
            ? await serviceApi.update(selected.id, payload)
            : await serviceApi.create(payload);

        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success(isEditing ? "Service updated" : "Service created");
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
      title={isEditing ? "Edit Service" : "Add Service"}
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
            {(field) => <field.Input label="Title" />}
          </form.AppField>
          <form.AppField name="slug">
            {(field) => <field.Input label="Slug" />}
          </form.AppField>
          <form.AppField name="summary">
            {(field) => <field.Textarea label="Summary" />}
          </form.AppField>
          <form.AppField name="content">
            {(field) => (
              <field.RichText
                label="Content"
                placeholder="Enter service content..."
              />
            )}
          </form.AppField>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="services"
            label="Service Image"
            onUploadingChange={setIsUploading}
          />
          <form.AppField name="metaTitle">
            {(field) => <field.Input label="Meta Title" />}
          </form.AppField>
          <form.AppField name="metaDescription">
            {(field) => <field.Textarea label="Meta Description" />}
          </form.AppField>
          <form.AppField name="metaKeywords">
            {(field) => <field.Input label="Meta Keywords" />}
          </form.AppField>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isUploading ? "Uploading..." : isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
}
