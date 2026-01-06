/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { toast } from "sonner";
import { z } from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { SelectItem } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

// Form schema (without defaults for form handling)
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0),
  isActive: z.boolean(),
  destinationId: z.string().min(1, "Destination is required"),
});

type FormData = z.infer<typeof formSchema>;

const sectionApi = createEntityApi<FormData & { id: string; content?: string | null }>(
  "/api/destination-sections"
);

interface DestinationOption {
  id: string;
  name: string;
  slug: string;
}

interface DestinationSectionData {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  content?: string | null;
  displayOrder: number;
  isActive: boolean;
  destinationId: string;
}

const DestinationSectionFormModal = ({
  isEditing,
  selected,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selected?: DestinationSectionData;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState<string>(selected?.content || "");

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
      title: selected?.title || "",
      slug: selected?.slug || "",
      destinationId: selected?.destinationId || "",
      image: selected?.image || "",
      displayOrder: selected?.displayOrder ?? 0,
      isActive: selected?.isActive ?? true,
    } as FormData,
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        let response;
        const submitData = {
          ...value,
          image: value.image || null,
          content: content || null,
        };

        if (isEditing && selected?.id) {
          response = await sectionApi.update(selected.id, submitData as any);
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
        onClose();
        onSuccess?.();
      } catch (err) {
        toast.error("Request failed");
        console.error(err);
      }
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    form.setFieldValue("title", title);
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setFieldValue("slug", slug);
    }
  };

  useEffect(() => {
    if (selected) {
      form.setFieldValue("title", selected.title || "");
      form.setFieldValue("slug", selected.slug || "");
      form.setFieldValue("destinationId", selected.destinationId || "");
      form.setFieldValue("image", selected.image || "");
      form.setFieldValue("displayOrder", selected.displayOrder ?? 0);
      form.setFieldValue("isActive", selected.isActive ?? true);
      setContent(selected.content || "");
    } else {
      form.reset();
      setContent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Section" : "Add Section"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
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

          <form.AppField name="title">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={field.state.value}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter section title"
                />
              </div>
            )}
          </form.AppField>

          <form.AppField name="slug">
            {(field) => <field.Input label="Slug" />}
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

          <div className="pt-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              label="Content"
              placeholder="Write your section content with markdown formatting..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="displayOrder">
              {(field) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Order</label>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              )}
            </form.AppField>

            <form.AppField name="isActive">
              {(field) => <field.Checkbox label="Active" />}
            </form.AppField>
          </div>

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

export default DestinationSectionFormModal;
