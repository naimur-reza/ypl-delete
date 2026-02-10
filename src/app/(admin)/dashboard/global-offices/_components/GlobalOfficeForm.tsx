/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FormBase } from "@/components/form/FormBase";
import { ImageUpload } from "@/components/ui/image-upload";
import { SelectItem } from "@/components/ui/select";
import {
  OpeningHoursEditor,
  OpeningHoursData,
} from "@/components/ui/opening-hours";

type GlobalOfficeWithCountries = {
  id: string;
  name: string;
  city?: string | null;
  subtitle?: string | null;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  mapUrl?: string | null;
  content?: string | null;
  image?: string | null;
  bannerImage?: string | null;
  openingHours?: OpeningHoursData | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  status?: "ACTIVE" | "DRAFT" | null;
  countries?: Array<{ country: { id: string } }>;
};

const globalOfficeApi = createEntityApi<GlobalOfficeWithCountries>(
  "/api/global-offices",
);

interface GlobalOfficeFormProps {
  initialData?: GlobalOfficeWithCountries;
  onSuccess?: () => void;
}

export function GlobalOfficeForm({
  initialData,
  onSuccess,
}: GlobalOfficeFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [openingHours, setOpeningHours] = useState<OpeningHoursData | null>(
    null,
  );
  const [isGlobal, setIsGlobal] = useState<boolean>(
    (initialData as any)?.isGlobal || false,
  );

  const form = useAppForm({
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      subtitle: initialData?.subtitle || "",
      slug: initialData?.slug || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      mapUrl: initialData?.mapUrl || "",
      content: initialData?.content || "",
      status: initialData?.status || "DRAFT",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      isGlobal: (initialData as any)?.isGlobal || false,
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
          openingHours: openingHours || null,
          countryIds: isGlobal ? [] : countryIds,
          isGlobal: isGlobal,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
          city: value.city || null,
        };

        if (isEditing && initialData?.id) {
          response = await globalOfficeApi.update(initialData.id, submitData);
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
            : "Global office created successfully",
        );
        form.reset();
        setCountryIds([]);
        setContent("");
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/global-offices"],
        });
        router.push("/dashboard/global-offices");
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
    if (initialData) {
      form.setFieldValue("name", initialData.name || "");
      form.setFieldValue("city", initialData.city || "");
      form.setFieldValue("subtitle", initialData.subtitle || "");
      form.setFieldValue("slug", initialData.slug || "");
      form.setFieldValue("email", initialData.email || "");
      form.setFieldValue("phone", initialData.phone || "");
      form.setFieldValue("address", initialData.address || "");
      form.setFieldValue("mapUrl", initialData.mapUrl || "");
      setContent(initialData.content || "");
      setImageUrl(initialData.image || "");
      setBannerImageUrl(initialData.bannerImage || "");
      setOpeningHours(initialData.openingHours || null);
      form.setFieldValue("status", initialData.status || "DRAFT");
      form.setFieldValue("metaTitle", initialData.metaTitle || "");
      form.setFieldValue("metaDescription", initialData.metaDescription || "");
      form.setFieldValue("metaKeywords", initialData.metaKeywords || "");

      if (initialData.countries) {
        const mappedIds = initialData.countries.map((c) => c.country.id);
        setCountryIds(mappedIds);
        form.setFieldValue("countryIds", mappedIds as any);
      }
      const globalVal = (initialData as any)?.isGlobal || false;
      setIsGlobal(globalVal);
      form.setFieldValue("isGlobal", globalVal as any);
    } else {
      form.reset();
      setCountryIds([]);
      setContent("");
      setOpeningHours(null);
      setIsGlobal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

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
        <form.AppField name="subtitle">
          {(field) => <field.Input label="Subtitle" />}
        </form.AppField>
        <form.AppField name="city">
          {(field) => <field.Input label="City" />}
        </form.AppField>
        <form.AppField name="slug">
          {(field) => (
            <FormBase label="Slug" description="">
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

        <div className="pt-4 mt-4">
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
              <FormBase label="Google Maps Iframe">
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
          <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />
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

        <form.AppField name="countryIds">
          {(field) => (
            <CountrySelect
              value={countryIds}
              onChange={(ids) => {
                setCountryIds(ids);
                form.setFieldValue("countryIds", ids as any);
              }}
              label="Select Countries"
              showGlobalOption={true}
              isGlobal={isGlobal}
              onGlobalChange={(checked) => {
                setIsGlobal(checked);
                form.setFieldValue("isGlobal", checked as any);
                if (checked) {
                  setCountryIds([]);
                  form.setFieldValue("countryIds", [] as any);
                }
              }}
            />
          )}
        </form.AppField>

        <div className="pt-4 mt-4">
          <h3 className="text-sm font-semibold mb-3">SEO & Status</h3>
          <form.AppField name="status">
            {(field) => (
              <field.Select label="Content Status">
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </field.Select>
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
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/global-offices")}
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
