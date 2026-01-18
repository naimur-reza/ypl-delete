/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { statSchema } from "@/schemas/stat";
import { toast } from "sonner";
import z from "zod";
import { createRestEntityApi } from "@/lib/api-client";
import { CountrySelect } from "@/components/ui/region-select";
import { SelectItem } from "@/components/ui/select";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";

type FormData = z.infer<typeof statSchema>;

const statApi = createRestEntityApi<FormData & { id: string }>("/api/stats");

const SECTION_OPTIONS = [
  { value: "about", label: "About Section" },
  { value: "hero", label: "Hero Slider" },
  { value: "faq", label: "FAQ Section" },
  { value: "event", label: "Events" },
  { value: "why-choose-us", label: "Why Choose Us" },
];

const ICON_OPTIONS = [
  { value: "MapPin", label: "Map Pin (Location)" },
  { value: "ArrowLeftRight", label: "Arrow Left Right (Exchange)" },
  { value: "Building2", label: "Building (Institution)" },
  { value: "GraduationCap", label: "Graduation Cap (Education)" },
  { value: "Users", label: "Users (People)" },
  { value: "Award", label: "Award (Achievement)" },
  { value: "Globe", label: "Globe (Global)" },
  { value: "CheckCircle", label: "Check Circle (Success)" },
  { value: "Star", label: "Star (Rating)" },
  { value: "Calendar", label: "Calendar (Time)" },
  { value: "Briefcase", label: "Briefcase (Career)" },
  { value: "BookOpen", label: "Book Open (Courses)" },
];

const COLOR_OPTIONS = [
  { value: "pink", label: "Pink" },
  { value: "emerald", label: "Emerald" },
  { value: "blue", label: "Blue" },
  { value: "indigo", label: "Indigo" },
  { value: "purple", label: "Purple" },
  { value: "orange", label: "Orange" },
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "cyan", label: "Cyan" },
  { value: "amber", label: "Amber" },
];

const StatFormModal = ({
  isEditing,
  selectedStat,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedStat?: {
    id: string;
    title: string;
    subtitle: string;
    icon?: string | null;
    color?: string | null;
    section: string;
    slideIndex?: number | null;
    sortOrder: number;
    status: "ACTIVE" | "DRAFT";
    countries?: Array<{ country?: { id: string }; countryId?: string }>;
  };
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryIds, setCountryIds] = useState<string[]>(
    (
      selectedStat?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || ""
      ) || []
    ).filter((id) => id !== "")
  );

  const form = useAppForm({
    defaultValues: {
      title: selectedStat?.title || "",
      subtitle: selectedStat?.subtitle || "",
      icon: selectedStat?.icon || "none",
      color: selectedStat?.color || "none",
      section: selectedStat?.section || "about",
      slideIndex: selectedStat?.slideIndex ?? null,
      sortOrder: selectedStat?.sortOrder ?? 0,
      status: selectedStat?.status || "ACTIVE",
      countryIds: countryIds,
    } satisfies FormData as FormData,
    validators: { onSubmit: statSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          icon: value.icon === "none" ? undefined : value.icon || undefined,
          color: value.color === "none" ? undefined : value.color || undefined,
          slideIndex: value.slideIndex ?? undefined,
          countryIds: countryIds,
        };

        if (isEditing && selectedStat?.id) {
          response = await statApi.update(selectedStat.id, submitData);
        } else {
          response = await statApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing ? "Stat updated successfully" : "Stat created successfully"
        );
        form.reset();
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
    if (selectedStat) {
      form.setFieldValue("title", selectedStat.title || "");
      form.setFieldValue("subtitle", selectedStat.subtitle || "");
      form.setFieldValue("icon", selectedStat.icon || "none");
      form.setFieldValue("color", selectedStat.color || "none");
      form.setFieldValue("section", selectedStat.section || "about");
      form.setFieldValue("slideIndex", selectedStat.slideIndex ?? null);
      form.setFieldValue("sortOrder", selectedStat.sortOrder ?? 0);
      form.setFieldValue("status", selectedStat.status || "ACTIVE");

      const countries = selectedStat.countries || [];
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
  }, [selectedStat]);

  const currentSection = form.state.values.section;

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Stat" : "Add Stat"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="title">
              {(field) => (
                <field.Input
                  label="Title"
                    
                />
              )}
            </form.AppField>

            <form.AppField name="subtitle">
              {(field) => (
                <field.Input
                  label="Subtitle"
        
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="section">
            {(field) => (
              <field.Select label="Section">
                {SECTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          {currentSection === "hero" && (
            <form.AppField name="slideIndex">
              {(field) => (
                <FormBase
                  label="Slide Index"
                  description="Which hero slide this stat belongs to (0 = first slide, 1 = second, etc.)"
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0"
                    value={field.state.value ?? ""}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    onBlur={field.handleBlur}
                    placeholder="0"
                  />
                </FormBase>
              )}
            </form.AppField>
          )}

          <form.AppField name="icon">
            {(field) => (
              <field.Select label="Icon (Optional)">
                <SelectItem value="none">No Icon</SelectItem>
                {ICON_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="color">
            {(field) => (
              <field.Select label="Color (Optional)">
                <SelectItem value="none">Default</SelectItem>
                {COLOR_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="sortOrder">
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

            <form.AppField name="status">
              {(field) => (
                <field.Select label="Status">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </field.Select>
              )}
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
};

export default StatFormModal;
