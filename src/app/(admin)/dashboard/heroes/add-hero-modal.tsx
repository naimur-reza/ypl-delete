/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { heroSchema } from "@/schemas/hero";
import { toast } from "sonner";
import z from "zod";
import { createRestEntityApi } from "@/lib/api-client";
import { CountrySelect } from "@/components/ui/region-select";
import { SelectItem } from "@/components/ui/select";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";

type FormData = z.infer<typeof heroSchema>;

const heroApi = createRestEntityApi<FormData & { id: string }>("/api/heroes");

const SLUG_OPTIONS = [
  { value: "home", label: "Home Page" },
  { value: "universities", label: "Universities Page" },
  { value: "courses", label: "Courses Page" },
  { value: "scholarships", label: "Scholarships Page" },
  { value: "events", label: "Events Page" },
  { value: "study-abroad", label: "Study Abroad Page" },
  { value: "services", label: "Services Page" },
];

const HeroFormModal = ({
  isEditing,
  selectedHero,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedHero?: {
    id: string;
    title: string;
    subtitle?: string | null;
    buttonText?: string | null;
    buttonUrl?: string | null;
    backgroundType: "IMAGE" | "VIDEO" | "YOUTUBE";
    backgroundUrl: string;
    slug: string;
    isActive: boolean;
    order: number;
    countries?: Array<{ country?: { id: string }; countryId?: string }>;
  };
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(
    selectedHero?.backgroundType === "IMAGE"
      ? selectedHero?.backgroundUrl || ""
      : ""
  );
  const [countryIds, setCountryIds] = useState<string[]>(
    (
      selectedHero?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || ""
      ) || []
    ).filter((id) => id !== "")
  );

  const form = useAppForm({
    defaultValues: {
      title: selectedHero?.title || "",
      subtitle: selectedHero?.subtitle || "",
      buttonText: selectedHero?.buttonText || "",
      buttonUrl: selectedHero?.buttonUrl || "",
      backgroundType: selectedHero?.backgroundType || "IMAGE",
      backgroundUrl: selectedHero?.backgroundUrl || "",
      slug: selectedHero?.slug || "",
      isActive: selectedHero?.isActive ?? true,
      order: selectedHero?.order ?? 0,
      countryIds: countryIds,
    } satisfies FormData as FormData,
    validators: {
      onSubmit: ({ value }) => {
        const result = heroSchema.safeParse(value);

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // Use imageUrl for IMAGE type, otherwise use backgroundUrl from form
        const backgroundUrl =
          value.backgroundType === "IMAGE" ? imageUrl : value.backgroundUrl;

        if (!backgroundUrl) {
          toast.error("Please provide a background image or URL");
          setIsSubmitting(false);
          return;
        }

        let response;
        const submitData = {
          ...value,
          subtitle: value.subtitle || undefined,
          buttonText: value.buttonText || undefined,
          buttonUrl: value.buttonUrl || undefined,
          backgroundUrl,
          countryIds: countryIds,
        };

        if (isEditing && selectedHero?.id) {
          response = await heroApi.update(selectedHero.id, submitData);
        } else {
          response = await heroApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing ? "Hero updated successfully" : "Hero created successfully"
        );
        form.reset();
        setImageUrl("");
        setCountryIds([]);
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
    if (selectedHero) {
      form.setFieldValue("title", selectedHero.title || "");
      form.setFieldValue("subtitle", selectedHero.subtitle || "");
      form.setFieldValue("buttonText", selectedHero.buttonText || "");
      form.setFieldValue("buttonUrl", selectedHero.buttonUrl || "");
      form.setFieldValue(
        "backgroundType",
        selectedHero.backgroundType || "IMAGE"
      );
      form.setFieldValue("backgroundUrl", selectedHero.backgroundUrl || "");
      form.setFieldValue("slug", selectedHero.slug || "");
      form.setFieldValue("isActive", selectedHero.isActive ?? true);
      form.setFieldValue("order", selectedHero.order ?? 0);

      // Set imageUrl for IMAGE type backgrounds
      if (selectedHero.backgroundType === "IMAGE") {
        setImageUrl(selectedHero.backgroundUrl || "");
      } else {
        setImageUrl("");
      }

      const countries = selectedHero.countries || [];
      const initialCountryIds = countries
        .map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || ""
        )
        .filter((id) => id !== "");
      setCountryIds(initialCountryIds);
      form.setFieldValue("countryIds", initialCountryIds);
    } else {
      form.reset();
      setImageUrl("");
      setCountryIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHero]);

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Hero" : "Add Hero"}
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

          <form.AppField name="subtitle">
            {(field) => <field.Textarea label="Subtitle (Optional)" rows={3} />}
          </form.AppField>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="buttonText">
              {(field) => <field.Input label="Button Text (Optional)" />}
            </form.AppField>

            <form.AppField name="buttonUrl">
              {(field) => <field.Input label="Button URL (Optional)" />}
            </form.AppField>
          </div>

          <form.AppField name="slug">
            {(field) => (
              <FormBase
                label="Page"
                description="Add multiple heroes for the same page to create a slider. Single hero shows as static."
              >
                <field.Select label="">
                  {SLUG_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </field.Select>
              </FormBase>
            )}
          </form.AppField>

          <form.AppField name="backgroundType">
            {(field) => (
              <field.Select label="Background Type">
                <SelectItem value="IMAGE">Image (Upload)</SelectItem>
                <SelectItem value="VIDEO">Video URL</SelectItem>
                <SelectItem value="YOUTUBE">YouTube URL</SelectItem>
              </field.Select>
            )}
          </form.AppField>

          {/* Show ImageUpload for IMAGE type */}
          {form.state.values.backgroundType === "IMAGE" && (
            <ImageUpload
              value={imageUrl}
              onChange={(url) => {
                setImageUrl(url);
                // Sync to form field so Zod validation passes
                form.setFieldValue("backgroundUrl", url);
              }}
              folder="heroes"
              label="Background Image"
              onUploadingChange={setIsUploading}
            />
          )}

          {/* Show URL input for VIDEO and YOUTUBE types */}
          {form.state.values.backgroundType !== "IMAGE" && (
            <form.AppField name="backgroundUrl">
              {(field) => (
                <FormBase
                  label={
                    form.state.values.backgroundType === "YOUTUBE"
                      ? "YouTube URL"
                      : "Video URL"
                  }
                  description={
                    form.state.values.backgroundType === "YOUTUBE"
                      ? "Enter any YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)"
                      : "Enter the direct URL for the video file"
                  }
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    placeholder={
                      form.state.values.backgroundType === "YOUTUBE"
                        ? "https://www.youtube.com/watch?v=..."
                        : "https://example.com/video.mp4"
                    }
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  />
                </FormBase>
              )}
            </form.AppField>
          )}

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="order">
              {(field) => (
                <FormBase label="Display Order">
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0"
                    value={field.state.value ?? 0}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value) || 0)
                    }
                    onBlur={field.handleBlur}
                  />
                </FormBase>
              )}
            </form.AppField>

            <form.AppField name="isActive">
              {(field) => <field.Checkbox label="Active" />}
            </form.AppField>
          </div>

          <form.AppField name="countryIds">
            {(field) => (
              <CountrySelect
                value={countryIds}
                onChange={(ids) => {
                  setCountryIds(ids);
                  field.handleChange(ids);
                }}
                label="Countries (Optional - Leave empty for all countries)"
              />
            )}
          </form.AppField>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <SubmitButton
              isSubmitting={isSubmitting || isUploading}
              submitText={isEditing ? "Update" : "Create"}
              submittingText={
                isUploading
                  ? "Uploading..."
                  : isEditing
                  ? "Updating..."
                  : "Creating..."
              }
            />
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default HeroFormModal;
