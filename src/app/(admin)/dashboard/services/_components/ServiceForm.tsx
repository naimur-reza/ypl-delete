/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/region-select";
import { SelectItem } from "@/components/ui/select";
import { IconPicker } from "@/components/ui/icon-picker";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  slug: z.string().min(1, "Slug is required").max(150),
  summary: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
  isGlobal: z.boolean().optional().default(false),
  countryIds: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  if (!data.isGlobal && (!data.countryIds || data.countryIds.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select at least one country",
      path: ["countryIds"],
    });
  }
});

type FormData = z.infer<typeof serviceSchema>;

const serviceApi = createEntityApi<{ id: string }>("/api/services");

interface ServiceFormProps {
  initialData?: { id: string; status?: "ACTIVE" | "DRAFT" } & Partial<FormData>;
  onSuccess?: () => void;
}

export function ServiceForm({ initialData, onSuccess }: ServiceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [countryIds, setCountryIds] = useState<string[]>(
    (initialData as any)?.countries?.map((c: { country?: { id: string }; countryId?: string }) => 
      c.country?.id || c.countryId || ""
    ).filter((id: string) => id !== "") || []
  );
  const [isGlobal, setIsGlobal] = useState<boolean>((initialData as any)?.isGlobal || false);

  const form = useAppForm({
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      summary: initialData?.summary || "",
      content: initialData?.content || "",
      image: initialData?.image || "",
      icon: initialData?.icon || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      status: initialData?.status || "ACTIVE",
      isGlobal: (initialData as any)?.isGlobal || false,
      countryIds: countryIds,
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
          icon: value.icon || null,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
          status: value.status || "ACTIVE",
          countryIds: isGlobal ? [] : countryIds,
          isGlobal: isGlobal,
        };

        const res =
          isEditing && initialData?.id
            ? await serviceApi.update(initialData.id, payload as any)
            : await serviceApi.create(payload as any);

        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success(isEditing ? "Service updated" : "Service created");
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/services"],
        });
        router.push("/dashboard/services");
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
        <form.AppField name="icon">
          {(field) => (
            <IconPicker
              label="Service Icon"
              value={field.state.value || ""}
              onChange={field.handleChange}
            />
          )}
        </form.AppField>
        <form.AppField name="metaTitle">
          {(field) => <field.Input label="Meta Title" />}
        </form.AppField>
        <form.AppField name="metaDescription">
          {(field) => <field.Textarea label="Meta Description" />}
        </form.AppField>
        <form.AppField name="metaKeywords">
          {(field) => <field.Input label="Meta Keywords" />}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.Select label="Status">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </field.Select>
          )}
        </form.AppField>
        <div className="pt-2">
          <CountrySelect
            value={countryIds}
            onChange={setCountryIds}
            label="Select Countries"
            showGlobalOption={true}
            isGlobal={isGlobal}
            onGlobalChange={(checked) => {
              setIsGlobal(checked);
              if (checked) setCountryIds([]);
            }}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/services")}
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
