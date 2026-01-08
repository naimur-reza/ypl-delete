/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";

const careerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  location: z.string().optional().nullable(),
  jobType: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  responsilities: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

type FormData = z.infer<typeof careerSchema>;

const api = createEntityApi<{ id: string }>("/api/careers");

export default function CareerFormModal({
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

  const form = useAppForm({
    defaultValues: {
      title: selected?.title || "",
      slug: selected?.slug || "",
      location: selected?.location || "",
      jobType: selected?.jobType || "",
      description: selected?.description || "",
      requirements: selected?.requirements || "",
      responsilities: selected?.responsilities || "",
      isActive: selected?.isActive ?? true,
    } as unknown as FormData,
    validators: { onSubmit: careerSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const payload = {
          ...value,
          location: value.location || null,
          jobType: value.jobType || null,
          description: value.description || null,
          requirements: value.requirements || null,
          isActive: value.isActive ?? true,
        } as Record<string, unknown>;

        const res =
          isEditing && selected?.id
            ? await api.update(selected.id, payload)
            : await api.create(payload);

        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success(isEditing ? "Career updated" : "Career created");
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

  // Auto-slug generation from title
  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: !!isEditing,
  });

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Career" : "Add Career"}
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
              <FormBase label="Title">
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    handleTitleChange(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                  placeholder="e.g., Senior Education Counselor"
                />
              </FormBase>
            )}
          </form.AppField>
          <form.AppField name="slug">
            {(field) => (
              <FormBase
                label="Slug"
                description="Auto-generated from title. You can edit if needed."
              >
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    const slugValue = generateSlug(e.target.value);
                    field.handleChange(slugValue);
                    handleSlugChange(slugValue);
                  }}
                  onBlur={field.handleBlur}
                  placeholder="e.g., senior-education-counselor"
                />
              </FormBase>
            )}
          </form.AppField>
          <form.AppField name="location">
            {(field) => <field.Input label="Location" />}
          </form.AppField>
          <form.AppField name="jobType">
            {(field) => <field.Input label="Job Type" />}
          </form.AppField>
          <form.AppField name="description">
            {(field) => (
              <field.RichText
                label="Description"
                placeholder="Enter job description..."
              />
            )}
          </form.AppField>
          <form.AppField name="requirements">
            {(field) => (
              <field.RichText
                label="Requirements"
                placeholder="Enter job requirements..."
              />
            )}
          </form.AppField>
          <form.AppField name="responsilities">
            {(field) => (
              <field.RichText
                label="Responsibilities"
                placeholder="Enter job responsibilities..."
              />
            )}
          </form.AppField>
          <form.AppField name="isActive">
            {(field) => <field.Checkbox label="Active" />}
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
