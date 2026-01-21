/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { blogSchema } from "@/schemas/blog";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";
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

interface BlogFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    image?: string | null;
    author?: string | null;
    category?: string | null;
    publishedAt?: string | null;
    isFeatured?: boolean;
    isGlobal?: boolean;
    status?: string | null;
    destinationId: string;
    countries?: Array<{ country?: { id: string }; countryId?: string }>;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  };
  onSuccess?: () => void;
}

export function BlogForm({ initialData, onSuccess }: BlogFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image || "");
  const [countryIds, setCountryIds] = useState<string[]>(
    (
      initialData?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || "",
      ) || []
    ).filter((id) => id !== ""),
  );
  const [isGlobal, setIsGlobal] = useState<boolean>(initialData?.isGlobal || false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  // Fetch current user for author field
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.get<{ user: { name: string } }>(
          "/api/auth/me",
        );
        if (response.data?.user?.name) {
          setCurrentUserName(response.data.user.name);
          // Auto-fill author field for new blogs
          if (!initialData) {
            form.setFieldValue("author", response.data.user.name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await apiClient.get<{ data: Destination[] }>(
          "/api/destinations",
          { limit: "1000" },
        );
        if (response.data) {
          setDestinations(
            Array.isArray(response.data)
              ? response.data
              : response.data.data || [],
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
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      image: initialData?.image || "",
      author: initialData?.author || "",
      category: initialData?.category || "",
      publishedAt: initialData?.publishedAt
        ? new Date(initialData.publishedAt).toISOString().split("T")[0]
        : "",
      isFeatured: initialData?.isFeatured ?? false,
      status: (initialData?.status as "ACTIVE" | "DRAFT") || "ACTIVE",
      destinationId: initialData?.destinationId || "",
      countryIds: countryIds,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
    } as FormData,
    validators: { onSubmit: blogSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          image: imageUrl || null,
          publishedAt: value.publishedAt || null,
          countryIds: isGlobal ? [] : countryIds,
          isGlobal: isGlobal,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
        };

        if (isEditing && initialData?.id) {
          response = await blogApi.update(initialData.id, submitData);
        } else {
          response = await blogApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing ? "Blog updated successfully" : "Blog created successfully",
        );
        form.reset();
        setImageUrl("");
        setCountryIds([]);
        setIsGlobal(false);
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/blogs"],
        });
        router.push("/dashboard/blogs");
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
      form.setFieldValue("excerpt", initialData.excerpt || "");
      form.setFieldValue("content", initialData.content || "");
      form.setFieldValue("author", initialData.author || "");
      form.setFieldValue("category", initialData.category || "");
      form.setFieldValue(
        "publishedAt",
        initialData.publishedAt
          ? new Date(initialData.publishedAt).toISOString().split("T")[0]
          : "",
      );
      form.setFieldValue("isFeatured", initialData.isFeatured || false);
      form.setFieldValue(
        "status",
        initialData.status === "DRAFT" ? "DRAFT" : "ACTIVE",
      );
      form.setFieldValue("destinationId", initialData.destinationId || "");
      const countries = initialData.countries || [];
      const initialCountryIds = countries
        .map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || "",
        )
        .filter((id) => id !== "");
      setCountryIds(initialCountryIds);
      form.setFieldValue("countryIds", initialCountryIds);
      form.setFieldValue("metaTitle", initialData.metaTitle || "");
      form.setFieldValue("metaDescription", initialData.metaDescription || "");
      form.setFieldValue("metaKeywords", initialData.metaKeywords || "");
      setImageUrl(initialData.image || "");
      setIsGlobal(initialData.isGlobal || false);
    } else {
      form.reset();
      setImageUrl("");
      setCountryIds([]);
      setIsGlobal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Auto-slug generation from title
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
              {destinations.map((dest) => (
                <SelectItem key={dest.id} value={dest.id}>
                  {dest.name}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="category">
          {(field) => (
            <FormBase label="Category">
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter blog category..."
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
        <form.AppField name="countryIds">
          {(field) => (
            <CountrySelect
              value={countryIds}
              onChange={(ids) => {
                setCountryIds(ids);
                field.handleChange(ids);
              }}
              label="Countries"
              showGlobalOption={true}
              isGlobal={isGlobal}
              onGlobalChange={(checked) => {
                setIsGlobal(checked);
                if (checked) {
                  setCountryIds([]);
                  field.handleChange([]);
                }
              }}
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
          {(field) => (
            <FormBase label="Author">
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value || currentUserName}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </FormBase>
          )}
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
            onClick={() => router.push("/dashboard/blogs")}
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
