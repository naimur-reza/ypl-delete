"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { countrySchema } from "@/schemas/country";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";

import { ImageUpload } from "@/components/ui/image-upload";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { Country } from "../../../../../../prisma/src/generated/prisma/browser";

type FormData = z.infer<typeof countrySchema>;

const countryApi = createEntityApi<Country>("/api/countries");

interface CountryFormProps {
  initialData?: Country;
  onSuccess?: () => void;
}

export function CountryForm({ initialData, onSuccess }: CountryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [countryFlag, setCountryFlag] = useState<string>(
    initialData?.flag || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      isoCode: initialData?.isoCode || "",
      flag: initialData?.flag || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
    } satisfies FormData as FormData,
    validators: { onSubmit: countrySchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          flag: countryFlag,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
        };

        if (isEditing && initialData?.id) {
          response = await countryApi.update(initialData.id, submitData);
        } else {
          response = await countryApi.create(
            submitData as unknown as Omit<
              Country,
              "id" | "createdAt" | "updatedAt"
            >
          );
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Country updated successfully"
            : "Country created successfully"
        );
        form.reset();
        router.push("/dashboard/countries");
        onSuccess?.();
      } catch (err) {
        toast.error("Request failed");
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setFieldValue("name", initialData.name || "");
      form.setFieldValue("slug", initialData.slug || "");
      form.setFieldValue("isoCode", initialData.isoCode || "");
      form.setFieldValue("flag", initialData.flag || "");
      form.setFieldValue("metaTitle", initialData.metaTitle || "");
      form.setFieldValue("metaDescription", initialData.metaDescription || "");
      form.setFieldValue("metaKeywords", initialData.metaKeywords || "");
      setCountryFlag(initialData.flag || "");
    } else {
      form.reset();
      setCountryFlag("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Auto-slug generation from name
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
        <form.AppField name="name">
          {(field) => (
            <FormBase label="Name">
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
            <FormBase
              label="Slug"
              description=""
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
           
              />
            </FormBase>
          )}
        </form.AppField>
        <form.AppField name="isoCode">
          {(field) => <field.Input label="ISO Code" />}
        </form.AppField>
        <ImageUpload
          label="Country Flag"
          value={countryFlag}
          folder="flags"
          onChange={setCountryFlag}
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
            onClick={() => router.push("/dashboard/countries")}
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
