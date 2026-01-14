/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { toast } from "sonner";
import { z } from "zod";
import { createRestEntityApi, apiClient } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { SelectItem } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
  destinationId: z.string().min(1, "Destination is required"),
});

type FormData = z.infer<typeof formSchema>;

const sectionApi = createRestEntityApi<
  FormData & { id: string; content?: string | null }
>("/api/destination-sections");

interface DestinationOption {
  id: string;
  name: string;
  slug: string;
}

interface DestinationSectionFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    image?: string | null;
    content?: string | null;
    displayOrder: number;
    status: "ACTIVE" | "DRAFT";
    destinationId: string;
  };
  onSuccess?: () => void;
}

export function DestinationSectionForm({
  initialData,
  onSuccess,
}: DestinationSectionFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState<string>(initialData?.content || "");

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoadingDestinations(true);
      try {
        const response = await apiClient.get<{ data: DestinationOption[] }>(
          "/api/destinations",
          { limit: "1000" }
        );
        if (response.data) {
          setDestinations(
            Array.isArray(response.data)
              ? response.data
              : response.data.data || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  const form = useAppForm({
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      destinationId: initialData?.destinationId || "",
      image: initialData?.image || "",
      displayOrder: initialData?.displayOrder ?? 0,
      status: initialData?.status ?? "DRAFT",
    } as FormData,
    validators: { onSubmit: formSchema as any},
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          image: value.image || null,
          content: content || null,
        };

        if (isEditing && initialData?.id) {
          response = await sectionApi.update(initialData.id, submitData as any);
        } else {
          response = await sectionApi.create(submitData as any);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Section updated successfully"
            : "Section created successfully"
        );
        form.reset();
        setContent("");
        router.push("/dashboard/destination-sections");
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
      form.setFieldValue("slug", initialData.slug || "");
      form.setFieldValue("destinationId", initialData.destinationId || "");
      form.setFieldValue("image", initialData.image || "");
      form.setFieldValue("displayOrder", initialData.displayOrder ?? 0);
      form.setFieldValue("status", initialData.status ?? "DRAFT");
      setContent(initialData.content || "");
    } else {
      form.reset();
      setContent("");
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
        <form.AppField name="title">
          {(field) => (
            <FormBase label="Title">
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
            <FormBase label="Slug">
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
        <form.AppField name="destinationId">
          {(field) => (
            <field.Select label="Destination">
              {loadingDestinations ? (
                <SelectItem value="__loading__" disabled>
                  Loading...
                </SelectItem>
              ) : destinations.length === 0 ? (
                <SelectItem value="__empty__" disabled>
                  No destinations available
                </SelectItem>
              ) : (
                destinations.map((destination) => (
                  <SelectItem key={destination.id} value={destination.id}>
                    {destination.name}
                  </SelectItem>
                ))
              )}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="image">
          {(field) => (
            <ImageUpload
              value={field.state.value || ""}
              onChange={field.handleChange}
              label="Section Image"
              folder="destination-sections"
              onUploadingChange={setIsUploading}
            />
          )}
        </form.AppField>
        <form.AppField name="displayOrder">
          {(field) => <field.Input label="Display Order" type="number" />}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.Select label="Status">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </field.Select>
          )}
        </form.AppField>
        <div className="pt-2">
          <RichTextEditor
            value={content}
            onChange={setContent}
            label="Content"
            placeholder="Write section content..."
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/destination-sections")}
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
