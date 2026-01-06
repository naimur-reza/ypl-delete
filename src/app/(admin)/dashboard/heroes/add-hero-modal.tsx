/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { heroSchema } from "@/schemas/hero";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { CountrySelect } from "@/components/ui/region-select";
import { SelectItem } from "@/components/ui/select";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";

type FormData = z.infer<typeof heroSchema>;

const heroApi = createEntityApi<FormData & { id: string }>("/api/heroes");

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
    validators: { onSubmit: heroSchema as any },
    onSubmit: async ({ value }) => {
      try {
        let response;
        const submitData = {
          ...value,
          subtitle: value.subtitle || undefined,
          buttonText: value.buttonText || undefined,
          buttonUrl: value.buttonUrl || undefined,
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
        setCountryIds([]);
        onClose();
        onSuccess?.();
      } catch (err) {
        toast.error("Request failed");
        console.error(err);
      }
    },
  });

  useEffect(() => {
    if (selectedHero) {
      form.setFieldValue("title", selectedHero.title || "");
      form.setFieldValue("subtitle", selectedHero.subtitle || "");
      form.setFieldValue("buttonText", selectedHero.buttonText || "");
      form.setFieldValue("buttonUrl", selectedHero.buttonUrl || "");
      form.setFieldValue("backgroundType", selectedHero.backgroundType || "IMAGE");
      form.setFieldValue("backgroundUrl", selectedHero.backgroundUrl || "");
      form.setFieldValue("slug", selectedHero.slug || "");
      form.setFieldValue("isActive", selectedHero.isActive ?? true);
      form.setFieldValue("order", selectedHero.order ?? 0);
      
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
                <SelectItem value="IMAGE">Image URL</SelectItem>
                <SelectItem value="VIDEO">Video URL</SelectItem>
                <SelectItem value="YOUTUBE">YouTube Embed URL</SelectItem>
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="backgroundUrl">
            {(field) => (
              <FormBase 
                label="Background URL" 
                description={
                  form.state.values.backgroundType === "YOUTUBE" 
                    ? "Enter YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)"
                    : "Enter the URL for the background media"
                }
              >
                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  placeholder={
                    form.state.values.backgroundType === "YOUTUBE"
                      ? "https://www.youtube.com/embed/..."
                      : "https://..."
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
                    onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default HeroFormModal;
