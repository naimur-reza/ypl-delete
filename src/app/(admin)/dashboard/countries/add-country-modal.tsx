"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
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
import { Country } from "../../../../../prisma/src/generated/prisma/browser";
import { ImageUpload } from "@/components/ui/image-upload";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";

type FormData = z.infer<typeof countrySchema>;

const countryApi = createEntityApi<Country>("/api/countries");

const CountryFormModal = ({
  isEditing,
  selectedCountry,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedCountry?: Country;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [countryFlag, setCountryFlag] = useState<string>(
    selectedCountry?.flag || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOpen = true;
  const form = useAppForm({
    defaultValues: {
      name: selectedCountry?.name || "",
      slug: selectedCountry?.slug || "",
      isoCode: selectedCountry?.isoCode || "",
      flag: selectedCountry?.flag || "",
      metaTitle: selectedCountry?.metaTitle || "",
      metaDescription: selectedCountry?.metaDescription || "",
      metaKeywords: selectedCountry?.metaKeywords || "",
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

        if (isEditing && selectedCountry?.id) {
          response = await countryApi.update(selectedCountry.id, submitData);
        } else {
          console.log(submitData);
          response = await countryApi.create(submitData as any);
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
        onClose();
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
    if (selectedCountry) {
      form.setFieldValue("name", selectedCountry.name || "");
      form.setFieldValue("slug", selectedCountry.slug || "");
      form.setFieldValue("isoCode", selectedCountry.isoCode || "");
      form.setFieldValue("flag", selectedCountry.flag || "");
      form.setFieldValue("metaTitle", selectedCountry.metaTitle || "");
      form.setFieldValue(
        "metaDescription",
        selectedCountry.metaDescription || ""
      );
      form.setFieldValue("metaKeywords", selectedCountry.metaKeywords || "");
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  // Auto-slug generation from name
  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: !!isEditing,
  });

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Country" : "Add Country"}
      onClose={onClose}
    >
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
                  placeholder="e.g., Australia"
                />
              </FormBase>
            )}
          </form.AppField>
          <form.AppField name="slug">
            {(field) => (
              <FormBase
                label="Slug"
                description="Auto-generated from name. You can edit if needed."
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
                  placeholder="e.g., australia"
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
              onClick={onClose}
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
    </Modal>
  );
};

export default CountryFormModal;
