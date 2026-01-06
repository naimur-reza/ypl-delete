/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { essentialSchema } from "@/schemas/essential";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { SelectItem } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

type FormData = z.infer<typeof essentialSchema>;

const essentialApi = createEntityApi<FormData & { id: string }>(
  "/api/essential-studies"
);

interface DestinationOption {
  id: string;
  name: string;
}

const EssentialFormModal = ({
  isEditing,
  selected,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selected?: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    content?: string | null;
    destinationId: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
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
      description: selected?.description || "",
      content: selected?.content || "",
    } satisfies FormData as FormData,
    validators: { onSubmit: essentialSchema },
    onSubmit: async ({ value }) => {
      try {
        let response;
        const submitData = {
          ...value,
          description: value.description || null,
          content: content || null,
        };

        if (isEditing && selected?.id) {
          response = await essentialApi.update(selected.id, submitData as any);
        } else {
          response = await essentialApi.create(submitData as any);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Essential updated successfully"
            : "Essential created successfully"
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

  useEffect(() => {
    if (selected) {
      form.setFieldValue("title", selected.title || "");
      form.setFieldValue("slug", selected.slug || "");
      form.setFieldValue("destinationId", selected.destinationId || "");
      form.setFieldValue("description", selected.description || "");
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
      title={isEditing ? "Edit Essential" : "Add Essential"}
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
          <form.AppField name="slug">
            {(field) => <field.Input label="Slug" />}
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
          <form.AppField name="description">
            {(field) => <field.Textarea label="Short Description" />}
          </form.AppField>
          <div className="pt-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              label="Content"
              placeholder="Write your content with markdown formatting..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default EssentialFormModal;
