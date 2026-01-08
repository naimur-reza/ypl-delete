/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { blogSchema } from "@/schemas/blog";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";
import { apiClient } from "@/lib/api-client";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/region-select";
import { SelectItem } from "@/components/ui/select";

type FormData = z.infer<typeof blogSchema>;

const blogApi = createEntityApi<FormData & { id: string }>("/api/blogs");

interface Destination {
  id: string;
  name: string;
}

const BlogFormModal = ({
  isEditing,
  selectedBlog,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedBlog?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    image?: string | null;
    author?: string | null;
    publishedAt?: string | null;
    isFeatured?: boolean;
    destinationId: string;
    countries?: Array<{ country?: { id: string }; countryId?: string }>;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  };
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(selectedBlog?.image || "");
  const [countryIds, setCountryIds] = useState<string[]>(
    (
      selectedBlog?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || ""
      ) || []
    ).filter((id) => id !== "")
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await apiClient.get<{ data: Destination[] }>(
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
      }
    };
    fetchDestinations();
  }, []);

  const form = useAppForm({
    defaultValues: {
      title: selectedBlog?.title || "",
      slug: selectedBlog?.slug || "",
      excerpt: selectedBlog?.excerpt || "",
      content: selectedBlog?.content || "",
      image: selectedBlog?.image || "",
      author: selectedBlog?.author || "",
      publishedAt: selectedBlog?.publishedAt
        ? new Date(selectedBlog.publishedAt).toISOString().split("T")[0]
        : "",
      isFeatured: selectedBlog?.isFeatured ?? false,
      destinationId: selectedBlog?.destinationId || "",
      countryIds: countryIds,
      metaTitle: selectedBlog?.metaTitle || "",
      metaDescription: selectedBlog?.metaDescription || "",
      metaKeywords: selectedBlog?.metaKeywords || "",
    } satisfies FormData as FormData,
    validators: { onSubmit: blogSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          image: imageUrl || null,
          publishedAt: value.publishedAt || null,
          countryIds: countryIds,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
        };

        if (isEditing && selectedBlog?.id) {
          response = await blogApi.update(selectedBlog.id, submitData);
        } else {
          response = await blogApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing ? "Blog updated successfully" : "Blog created successfully"
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
    if (selectedBlog) {
      form.setFieldValue("title", selectedBlog.title || "");
      form.setFieldValue("slug", selectedBlog.slug || "");
      form.setFieldValue("excerpt", selectedBlog.excerpt || "");
      form.setFieldValue("content", selectedBlog.content || "");
      form.setFieldValue("author", selectedBlog.author || "");
      form.setFieldValue(
        "publishedAt",
        selectedBlog.publishedAt
          ? new Date(selectedBlog.publishedAt).toISOString().split("T")[0]
          : ""
      );
      form.setFieldValue("isFeatured", selectedBlog.isFeatured || false);
      form.setFieldValue("destinationId", selectedBlog.destinationId || "");
      const countries = selectedBlog.countries || [];
      const initialCountryIds = countries
        .map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || ""
        )
        .filter((id) => id !== "");
      setCountryIds(initialCountryIds);
      form.setFieldValue("countryIds", initialCountryIds);
      form.setFieldValue("metaTitle", selectedBlog.metaTitle || "");
      form.setFieldValue("metaDescription", selectedBlog.metaDescription || "");
      form.setFieldValue("metaKeywords", selectedBlog.metaKeywords || "");
      setImageUrl(selectedBlog.image || "");
    } else {
      form.reset();
      setImageUrl("");
      setCountryIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlog]);

  // Auto-slug generation from title
  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: !!isEditing,
  });

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Blog" : "Add Blog"}
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
                  placeholder="e.g., Top 10 Universities in Australia"
                />
              </FormBase>
            )}
          </form.AppField>
          <form.AppField name="slug">
            {(field) => (
              <FormBase
                label="Slug"
                description="Auto-generated from title. You can edit if needed."
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
                  placeholder="e.g., top-10-universities-in-australia"
                />
              </FormBase>
            )}
          </form.AppField>
          <form.AppField name="destinationId">
            {(field) => (
              <field.Select label="Destination">
                {destinations.map((dest) => (
                  <SelectItem key={dest.id} value={dest.id}>
                    {dest.name}
                  </SelectItem>
                ))}
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
                label="Countries"
              />
            )}
          </form.AppField>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="blogs"
            label="Blog Image"
            onUploadingChange={setIsUploading}
          />
          <form.AppField name="excerpt">
            {(field) => <field.Textarea label="Excerpt" />}
          </form.AppField>
          <form.AppField name="content">
            {(field) => (
              <field.RichText
                label="Content"
                placeholder="Enter blog content..."
              />
            )}
          </form.AppField>

          <form.AppField name="author">
            {(field) => <field.Input label="Author" />}
          </form.AppField>
          <form.AppField name="publishedAt">
            {(field) => (
              <FormBase label="Published Date">
                <Input
                  id={field.name}
                  name={field.name}
                  type="datetime-local"
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
          <form.AppField name="isFeatured">
            {(field) => <field.Checkbox label="Featured" />}
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

export default BlogFormModal;
