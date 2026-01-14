/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { SelectItem } from "@/components/ui/select";

const careerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  location: z.string().optional().nullable(),
  jobType: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  responsibilities: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
});

type FormData = z.infer<typeof careerSchema>;

const api = createEntityApi<{ id: string }>("/api/careers");

interface CareerFormProps {
  initialData?: { id: string } & Partial<FormData>;
  onSuccess?: () => void;
}

export function CareerForm({ initialData, onSuccess }: CareerFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm({
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      location: initialData?.location || "",
      jobType: initialData?.jobType || "",
      description: initialData?.description || "",
      requirements: initialData?.requirements || "",
      responsibilities: initialData?.responsibilities || "",
      status: initialData?.status || "ACTIVE",
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
          responsibilities: value.responsibilities || null,
          status: value.status || "ACTIVE",
        } as Record<string, unknown>;

        const res =
          isEditing && initialData?.id
            ? await api.update(initialData.id, payload)
            : await api.create(payload);

        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success(isEditing ? "Career updated" : "Career created");
        router.push("/dashboard/careers");
        onSuccess?.();
      } catch (e) {
        toast.error("Request failed");
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: isEditing,
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
                
              />
            </FormBase>
          )}
        </form.AppField>
        <form.AppField name="slug">
          {(field) => (
            <FormBase label="Slug">
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
          {(field) => <field.RichText label="Description" />}
        </form.AppField>
        <form.AppField name="requirements">
          {(field) => <field.RichText label="Requirements" />}
        </form.AppField>
        <form.AppField name="responsibilities">
          {(field) => <field.RichText label="Responsibilities" />}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.Select label="Status">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </field.Select>
          )}
        </form.AppField>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/careers")}
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
