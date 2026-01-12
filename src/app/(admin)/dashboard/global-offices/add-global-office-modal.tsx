/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { globalOfficeSchema } from "@/schemas/global-office";
import { toast } from "sonner";
import { createEntityApi } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { CountrySelect } from "@/components/ui/region-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FormBase } from "@/components/form/FormBase";
import { ImageUpload } from "@/components/ui/image-upload";

type GlobalOfficeWithCountries = {
  id: string;
  name: string;
  subtitle?: string | null;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  mapUrl?: string | null;
  content?: string | null;
  image?: string | null;
  bannerImage?: string | null;
  openingHours?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  countries?: Array<{ country: { id: string } }>;
};

const globalOfficeApi = createEntityApi<GlobalOfficeWithCountries>(
  "/api/global-offices"
);


const GlobalOfficeFormModal = ({
  isEditing,
  selectedGlobalOffice,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedGlobalOffice?: GlobalOfficeWithCountries;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");

  const form = useAppForm({
    defaultValues: {
      name: selectedGlobalOffice?.name || "",
      subtitle: selectedGlobalOffice?.subtitle || "",
      slug: selectedGlobalOffice?.slug || "",
      email: selectedGlobalOffice?.email || "",
      phone: selectedGlobalOffice?.phone || "",
      address: selectedGlobalOffice?.address || "",
      mapUrl: selectedGlobalOffice?.mapUrl || "",
      openingHours: selectedGlobalOffice?.openingHours || "10:30 AM – 7 PM (Friday Closed)",
      content: selectedGlobalOffice?.content || "",
      metaTitle: selectedGlobalOffice?.metaTitle || "",
      metaDescription: selectedGlobalOffice?.metaDescription || "",
      metaKeywords: selectedGlobalOffice?.metaKeywords || "",
    } as any,
    validators: { onSubmit: globalOfficeSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;

        const submitData = {
          ...value,
          content: content || null,
          image: imageUrl || null,
          bannerImage: bannerImageUrl || null,
          openingHours: value.openingHours || null,
          countryIds,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
        };

        if (isEditing && selectedGlobalOffice?.id) {
          response = await globalOfficeApi.update(
            selectedGlobalOffice.id,
            submitData
          );
        } else {
          response = await globalOfficeApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Global office updated successfully"
            : "Global office created successfully"
        );
        form.reset();
        setCountryIds([]);
        setContent("");
        onClose();
        onSuccess?.();
      } catch (err: any) {
        if (err?.issues && Array.isArray(err.issues)) {
          const firstError = err.issues[0];
          toast.error(firstError.message || "Validation error");
          return;
        }

        if (err?.response?.error) {
          toast.error(err.response.error);
          return;
        }

        toast.error(err?.message || "Request failed");
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (selectedGlobalOffice) {
      form.setFieldValue("name", selectedGlobalOffice.name || "");
      form.setFieldValue("subtitle", selectedGlobalOffice.subtitle || "");
      form.setFieldValue("slug", selectedGlobalOffice.slug || "");
      form.setFieldValue("email", selectedGlobalOffice.email || "");
      form.setFieldValue("phone", selectedGlobalOffice.phone || "");
      form.setFieldValue("address", selectedGlobalOffice.address || "");
      form.setFieldValue("mapUrl", selectedGlobalOffice.mapUrl || "");
      setContent(selectedGlobalOffice.content || "");
      setImageUrl(selectedGlobalOffice.image || "");
      setBannerImageUrl(selectedGlobalOffice.bannerImage || "");
      form.setFieldValue("openingHours", selectedGlobalOffice.openingHours || "10:30 AM – 7 PM (Friday Closed)");
      form.setFieldValue("metaTitle", selectedGlobalOffice.metaTitle || "");
      form.setFieldValue("metaDescription", selectedGlobalOffice.metaDescription || "");
      form.setFieldValue("metaKeywords", selectedGlobalOffice.metaKeywords || "");

      if (selectedGlobalOffice.countries) {
        setCountryIds(selectedGlobalOffice.countries.map((c) => c.country.id));
      }
    } else {
      form.reset();
      setCountryIds([]);
      setContent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGlobalOffice]);

  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: !!isEditing,
  });

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Global Office" : "Add Global Office"}
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
                  placeholder="e.g., NWC Dubai Office"
                />
              </FormBase>
            )}
          </form.AppField>
          <form.AppField name="subtitle">
            {(field) => <field.Input label="Subtitle" />}
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
                  placeholder="e.g., nwc-dubai-office"
                />
              </FormBase>
            )}
          </form.AppField>

          <div className=" pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Contact Details</h3>
            <form.AppField name="email">
              {(field) => <field.Input label="Email" />}
            </form.AppField>
            <form.AppField name="phone">
              {(field) => <field.Input label="Phone" />}
            </form.AppField>
          </div>

          <div className="pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Location</h3>
            <form.AppField name="address">
              {(field) => <field.Textarea label="Address" />}
            </form.AppField>
            <form.AppField name="mapUrl">
              {(field) => (
                <FormBase 
                  label="Google Maps Iframe" 
                  description="Paste the Google Maps embed iframe here."
                >
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="<iframe src='...' ...></iframe>"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormBase>
              )}
            </form.AppField>
          </div>

          <div className="pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Office Media</h3>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              label="Office Image"
              folder="global-offices"
              onUploadingChange={setIsUploading}
            />
            <div className="mt-4">
              <ImageUpload
                value={bannerImageUrl}
                onChange={setBannerImageUrl}
                label="Banner Image"
                folder="global-offices"
                onUploadingChange={setIsUploading}
              />
            </div>
          </div>

          <div className="pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Opening Hours</h3>
            <form.AppField name="openingHours">
              {(field) => (
                <FormBase 
                  label="Office Hours" 
                  description="Standard hours: 10:30 AM – 7 PM (Friday Closed)"
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="10:30 AM – 7 PM (Friday Closed)"
                  />
                </FormBase>
              )}
            </form.AppField>
          </div>

          <div className="pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Content</h3>
            <RichTextEditor
              value={content}
              onChange={setContent}
              label="Office Content"
              placeholder="Enter detailed information about this office..."
            />
          </div>

          <div className=" ">
            <CountrySelect
              value={countryIds}
              onChange={setCountryIds}
              label="Select Countries"
            />
          </div>

          <div className=" ">
            <form.AppField name="metaTitle">
              {(field) => <field.Input label="Meta Title" />}
            </form.AppField>
            <form.AppField name="metaDescription">
              {(field) => <field.Textarea label="Meta Description" />}
            </form.AppField>
            <form.AppField name="metaKeywords">
              {(field) => <field.Input label="Meta Keywords" />}
            </form.AppField>
          </div>

          <div className="flex gap-2 justify-end mt-6">
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

export default GlobalOfficeFormModal;
