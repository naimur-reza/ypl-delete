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
import { destinationSchema } from "@/schemas/destination";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { generateSlug, cn } from "@/lib/utils";
import { CountrySelect } from "@/components/ui/region-select";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { SelectItem } from "@/components/ui/select";

import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Destination } from "../../../../../../prisma/src/generated/prisma/browser";

type FormData = z.infer<typeof destinationSchema>;

const destinationApi = createEntityApi<{ id: string }>("/api/destinations");

interface DestinationSection {
  id?: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  displayOrder: number;
}

interface DestinationFormProps {
  initialData?: Destination & {
    country?: { name: string };
    countries?: Array<{ country: { id: string } }>;
    thumbnail?: string | null;
    status?: "ACTIVE" | "DRAFT";
    sections?: DestinationSection[];
  };
  onSuccess?: () => void;
}

export function DestinationForm({
  initialData,
  onSuccess,
}: DestinationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sections, setSections] = useState<DestinationSection[]>([]);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const form = useAppForm({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      countryIds: initialData?.countries?.map((c) => c.country.id) || [],
      heroTitle: initialData?.heroTitle || "",
      heroSubtitle: initialData?.heroSubtitle || "",
      thumbnail: initialData?.thumbnail || "",
      whyChoose: initialData?.whyChoose || "",
      topUniversities: initialData?.topUniversities || "",
      campusAndCommunity: initialData?.campusAndCommunity || "",
      destinationLife: initialData?.destinationLife || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      status: (initialData?.status as "ACTIVE" | "DRAFT") || "ACTIVE",
    } as FormData,
    validators: { onSubmit: destinationSchema as any },
    onSubmit: async ({ value }) => {
      const castValue = value as any;
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          countryIds: countryIds,
          sections: sections.map((s, i) => ({ ...s, displayOrder: i })),
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
          status: value.status || "ACTIVE",
        };

        if (isEditing && initialData?.id) {
          response = await destinationApi.update(
            initialData.id,
            submitData as unknown as Record<string, unknown>
          );
        } else {
          response = await destinationApi.create(
            submitData as unknown as Record<string, unknown>
          );
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Destination updated successfully"
            : "Destination created successfully"
        );
        form.reset();
        setCountryIds([]);
        setSections([]);
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/destinations"],
        });
        router.push("/dashboard/destinations");
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
      const initialCountryIds =
        initialData.countries?.map((c) => c.country.id) || [];
      setCountryIds(initialCountryIds);
      setSections(initialData.sections || []);

      const values: Partial<FormData> = {
        name: initialData.name || "",
        slug: initialData.slug || "",
        countryIds: initialCountryIds,
        heroTitle: initialData.heroTitle || "",
        heroSubtitle: initialData.heroSubtitle || "",
        thumbnail: initialData.thumbnail || "",
        whyChoose: initialData.whyChoose || "",
        topUniversities: initialData.topUniversities || "",
        campusAndCommunity: initialData.campusAndCommunity || "",
        destinationLife: initialData.destinationLife || "",
        metaTitle: initialData.metaTitle || "",
        metaDescription: initialData.metaDescription || "",
        metaKeywords: initialData.metaKeywords || "",
        status: initialData.status || "ACTIVE",
      };

      (Object.keys(values) as Array<keyof FormData>).forEach((key) => {
        if (values[key] !== undefined) {
          form.setFieldValue(key, values[key]);
        }
      });
    } else {
      setCountryIds([]);
      setSections([]);
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const addSection = () => {
    const newSection: DestinationSection = {
      title: "",
      slug: "",
      image: "",
      content: "",
      displayOrder: sections.length,
    };
    setSections([...sections, newSection]);
    setExpandedSection(sections.length);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
    if (expandedSection === index) {
      setExpandedSection(null);
    }
  };

  const updateSection = (
    index: number,
    field: keyof DestinationSection,
    value: any
  ) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "title") {
      updated[index].slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    setSections(updated);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updated = [...sections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSections(updated);
    setExpandedSection(newIndex);
  };

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
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Basic Information
          </h3>
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
          <form.AppField name="countryIds">
            {(field) => (
              <CountrySelect
                value={countryIds}
                onChange={(ids) => {
                  setCountryIds(ids);
                  field.handleChange(ids);
                }}
                label="Select Countries"
              />
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

        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Hero Section
          </h3>
          <form.AppField name="heroTitle">
            {(field) => <field.Input label="Hero Title" />}
          </form.AppField>
          <form.AppField name="heroSubtitle">
            {(field) => <field.Input label="Hero Subtitle" />}
          </form.AppField>
          <form.AppField name="thumbnail">
            {(field) => (
              <ImageUpload
                value={field.state.value || ""}
                onChange={field.handleChange}
                label="Thumbnail Image"
                folder="destinations"
                onUploadingChange={setIsUploading}
              />
            )}
          </form.AppField>
        </div>

        <div className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Why Choose Sections (Tabs)
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSection}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Tab
            </Button>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm mb-2">
                No sections added yet
              </p>
              <p className="text-muted-foreground text-xs">
                Add tabs like &quot;Top Universities&quot;, &quot;Campus
                Life&quot;, etc.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden bg-card"
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors",
                      expandedSection === index && "bg-muted/50"
                    )}
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === index ? null : index
                      )
                    }
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 font-medium text-sm">
                      {section.title || `Section ${index + 1}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(index, "up");
                        }}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(index, "down");
                        }}
                        disabled={index === sections.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(index);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {expandedSection === index && (
                    <div className="p-4 border-t space-y-4 bg-background">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Tab Title
                          </label>
                          <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={section.title}
                            onChange={(e) =>
                              updateSection(index, "title", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Slug</label>
                          <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground"
                            value={section.slug}
                            onChange={(e) =>
                              updateSection(index, "slug", e.target.value)
                            }
                            placeholder="auto-generated"
                          />
                        </div>
                      </div>

                      <ImageUpload
                        value={section.image}
                        onChange={(url) => updateSection(index, "image", url)}
                        label="Section Image"
                        folder="destination-sections"
                      />

                      <RichTextEditor
                        value={section.content}
                        onChange={(val) => updateSection(index, "content", val)}
                        label="Content"
                        placeholder="Write section content..."
                        editorKey={`section-${index}-${
                          section.image || "no-image"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            SEO Settings
          </h3>
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

        <div className="flex gap-2 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/destinations")}
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
