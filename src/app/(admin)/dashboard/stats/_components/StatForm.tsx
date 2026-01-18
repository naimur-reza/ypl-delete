/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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

interface StatFormProps {
  initialData?: {
    id: string;
    title: string;
    subtitle: string;
    icon?: string | null;
    color?: string | null;
    section: string;
    slideIndex?: number | null;
    sortOrder: number;
    status?: "ACTIVE" | "DRAFT";
    countries?: Array<{ country?: { id: string }; countryId?: string }>;
  };
  onSuccess?: () => void;
}

export function StatForm({ initialData, onSuccess }: StatFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryIds, setCountryIds] = useState<string[]>(
    (
      initialData?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || ""
      ) || []
    ).filter((id) => id !== "")
  );

  const form = useAppForm({
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      icon: initialData?.icon || "none",
      color: initialData?.color || "none",
      section: initialData?.section || "about",
      slideIndex: initialData?.slideIndex ?? null,
      sortOrder: initialData?.sortOrder ?? 0,
      status: (initialData?.status as "ACTIVE" | "DRAFT") || "ACTIVE",
      countryIds: countryIds,
    } as FormData,
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
          status: value.status || "ACTIVE",
          countryIds: countryIds,
        };

        if (isEditing && initialData?.id) {
          response = await statApi.update(initialData.id, submitData);
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
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/stats"],
        });
        router.push("/dashboard/stats");
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
      form.setFieldValue("title", initialData.title || "");
      form.setFieldValue("subtitle", initialData.subtitle || "");
      form.setFieldValue("icon", initialData.icon || "none");
      form.setFieldValue("color", initialData.color || "none");
      form.setFieldValue("section", initialData.section || "about");
      form.setFieldValue("slideIndex", initialData.slideIndex ?? null);
      form.setFieldValue("sortOrder", initialData.sortOrder ?? 0);
      const initialCountryIds =
        initialData.countries?.map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || ""
        ) || [];
      setCountryIds(initialCountryIds.filter((id) => id !== ""));
      form.setFieldValue("countryIds", initialCountryIds);
    } else {
      form.reset();
      setCountryIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  return (
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
          {(field) => <field.Input label="Subtitle" />}
        </form.AppField>
        <form.AppField name="icon">
          {(field) => (
            <field.Select label="Icon">
              <SelectItem value="none">None</SelectItem>
              {ICON_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="color">
          {(field) => (
            <field.Select label="Color">
              <SelectItem value="none">None</SelectItem>
              {COLOR_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="section">
          {(field) => (
            <field.Select label="Section">
              {SECTION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="slideIndex">
          {(field) => <field.Input label="Slide Index" type="number" />}
        </form.AppField>
        <form.AppField name="sortOrder">
          {(field) => <field.Input label="Sort Order" type="number" />}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.Select label="Status">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="countryIds">
          {(field) => (
            <CountrySelect
              value={countryIds}
              onChange={(ids) => {
                setCountryIds(ids);
                field.handleChange(ids);
              }}
              label="Select Countries (Optional)"
            />
          )}
        </form.AppField>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/stats")}
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
