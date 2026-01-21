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
import { essentialSchema } from "@/schemas/essential";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { SelectItem } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/region-select";
import { EssentialStudy } from "../../../../../../prisma/src/generated/prisma/client";

type FormData = z.infer<typeof essentialSchema>;

const essentialApi = createEntityApi<FormData & { id: string }>(
  "/api/essential-studies",
);

interface DestinationOption {
  id: string;
  name: string;
}

interface EssentialFormProps {
  initialData?: EssentialStudy;
  onSuccess?: () => void;
}

export function EssentialForm({ initialData, onSuccess }: EssentialFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [content, setContent] = useState<string>(initialData?.content || "");
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [isGlobal, setIsGlobal] = useState<boolean>((initialData as any)?.isGlobal || false);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoadingDestinations(true);
      try {
        const response = await apiClient.get<{ data: DestinationOption[] }>(
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
      description: initialData?.description || "",
      content: initialData?.content || "",
      status: initialData?.status || "DRAFT",
    } satisfies FormData as FormData,
    validators: { onSubmit: essentialSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          description: value.description || null,
          content: content || null,
          countryIds: isGlobal ? [] : countryIds,
          isGlobal: isGlobal,
        };

        if (isEditing && initialData?.id) {
          response = await essentialApi.update(
            initialData.id,
            submitData as any,
          );
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
            : "Essential created successfully",
        );
        form.reset();
        setContent("");
        setCountryIds([]);
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/essential-studies"],
        });
        router.push("/dashboard/essentials");
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
      form.setFieldValue("description", initialData.description || "");
      setContent(initialData.content || "");
      // Set countryIds from initialData.countries
      const initialCountryIds = (initialData as any)?.countries?.map(
        (c: { country?: { id: string }; countryId?: string }) => c.country?.id || c.countryId || ""
      ).filter((id: string) => id !== "") || [];
      setCountryIds(initialCountryIds);
      setIsGlobal((initialData as any)?.isGlobal || false);
    } else {
      form.reset();
      setContent("");
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
        <form.AppField name="status">
          {(field) => (
            <field.Select label="Status">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </field.Select>
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
        <div className="pt-2">
          <CountrySelect
            value={countryIds}
            onChange={setCountryIds}
            label="Select Countries"
            showGlobalOption={true}
            isGlobal={isGlobal}
            onGlobalChange={(checked) => {
              setIsGlobal(checked);
              if (checked) setCountryIds([]);
            }}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/essentials")}
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
