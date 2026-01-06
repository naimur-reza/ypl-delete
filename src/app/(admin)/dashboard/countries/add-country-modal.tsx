"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { countrySchema } from "@/schemas/country";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { Country } from "../../../../../prisma/src/generated/prisma/browser";
import { ImageUpload } from "@/components/ui/image-upload";
 

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
            {(field) => <field.Input label="Name" />}
          </form.AppField>
          <form.AppField name="slug">
            {(field) => <field.Input label="Slug" />}
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default CountryFormModal;
