"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { universitySchema } from "@/schemas/university";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { SelectItem } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { ImageUpload } from "@/components/ui/image-upload";
import { CountrySelect } from "@/components/ui/region-select";
import { University } from "../../../../../prisma/src/generated/prisma/browser";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";

type FormData = z.infer<typeof universitySchema>;

const universityApi = createEntityApi<University>("/api/universities");

interface Destination {
  id: string;
  name: string;
}

// Custom hook for fetching dropdown data
const useFetchData = <T,>(endpoint: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<{ data: T[] }>(endpoint, {
          limit: "1000",
        });
        if (response.data) {
          setData(
            Array.isArray(response.data)
              ? response.data
              : response.data.data || []
          );
        }
      } catch (err) {
        console.error(`Failed to fetch ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  return { data, loading };
};

const UniversityFormModal = ({
  isEditing,
  selectedUniversity,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedUniversity?: University & {
    country?: { name: string };
    destination?: { name: string };
    countries?: Array<{ country: { id: string } }>;
  };
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const { data: destinations, loading: loadingDestinations } =
    useFetchData<Destination>("/api/destinations");

  const [imageUrl, setImageUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDefaultValues = (): FormData => ({
    name: selectedUniversity?.name || "",
    slug: selectedUniversity?.slug || "",
    logo: selectedUniversity?.logo || "",
    thumbnail: selectedUniversity?.thumbnail || "",
    description: selectedUniversity?.description || "",
    providerType: selectedUniversity?.providerType || "PRIVATE",
    isFeatured: selectedUniversity?.isFeatured ?? false,
    status: (selectedUniversity?.status as any) || "ACTIVE",
    website: selectedUniversity?.website || "",
    address: selectedUniversity?.address || "",
    phone: selectedUniversity?.phone || "",
    email: selectedUniversity?.email || "",
    countryIds: selectedUniversity?.countries?.map((c) => c.country.id) || [],
    destinationId: selectedUniversity?.destinationId || "",
    metaTitle: selectedUniversity?.metaTitle || "",
    metaDescription: selectedUniversity?.metaDescription || "",
    metaKeywords: selectedUniversity?.metaKeywords || "",
  });

  const form = useAppForm({
    defaultValues: getDefaultValues(),
    validators: { onSubmit: universitySchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const transformToNullable = (data: FormData) => ({
          ...data,
          logo: logoUrl || null,
          thumbnail: imageUrl || null,
          description: data.description || null,
          website: data.website || null,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          metaKeywords: data.metaKeywords || null,
        });

        const submitData = {
          ...transformToNullable(value),
          countryIds: countryIds,
        };

        const response =
          isEditing && selectedUniversity?.id
            ? await universityApi.update(
                selectedUniversity.id,
                submitData as Partial<University>
              )
            : await universityApi.create({
                ...submitData,
                createdBy: null,
                updatedBy: null,
              } as Omit<University, "id" | "createdAt" | "updatedAt">);

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "University updated successfully"
            : "University created successfully"
        );
        form.reset();
        setCountryIds([]);
        setImageUrl("");
        setLogoUrl("");
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
    if (selectedUniversity) {
      const initialCountryIds =
        selectedUniversity.countries?.map((c) => c.country.id) || [];
      setCountryIds(initialCountryIds);
      form.setFieldValue("countryIds", initialCountryIds);
      setImageUrl(selectedUniversity.thumbnail || "");
      setLogoUrl(selectedUniversity.logo || "");
    } else {
      setCountryIds([]);
      form.setFieldValue("countryIds", []);
      setImageUrl("");
      setLogoUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUniversity]);

  // Auto-slug generation from name
  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: !!isEditing,
  });

  return (
    <Modal
      isOpen
      title={isEditing ? "Edit University" : "Add University"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
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
          <ImageUpload
            value={logoUrl}
            onChange={setLogoUrl}
            folder="universities/logos"
            label="University Logo"
            onUploadingChange={setIsLogoUploading}
          />
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="universities"
            label="University Image"
            onUploadingChange={setIsUploading}
          />
          <form.AppField name="rankingNumber">
            {(field) => (
              <field.Input label="Ranking Number" type="number" min={1} />
            )}
          </form.AppField>
          <form.AppField name="costOfStudying">
            {(field) => (
              <field.Input
                label="Cost of Studying"
                placeholder="e.g. 10,000 USD/year"
              />
            )}
          </form.AppField>
          <form.AppField name="description">
            {(field) => <field.Textarea label="Description" />}
          </form.AppField>
          <form.AppField name="providerType">
            {(field) => (
              <field.Select label="Provider Type">
                <SelectItem value="UNIVERSITY">University</SelectItem>
                <SelectItem value="GOVERNMENT">Government</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="EMBASSY">Embassy</SelectItem>
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
                label="Select Countries"
              />
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
                  destinations.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))
                )}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="website">
            {(field) => <field.Input label="Website" />}
          </form.AppField>
          <form.AppField name="address">
            {(field) => <field.Input label="Address" />}
          </form.AppField>
          <form.AppField name="phone">
            {(field) => <field.Input label="Phone" />}
          </form.AppField>
          <form.AppField name="email">
            {(field) => <field.Input label="Email" />}
          </form.AppField>
          <form.AppField name="isFeatured">
            {(field) => <field.Checkbox label="Featured" />}
          </form.AppField>
          <form.AppField name="status">
            {(field) => (
              <field.Select label="Status">
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </field.Select>
            )}
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
              isUploading={isUploading || isLogoUploading}
              submitText={isEditing ? "Update" : "Create"}
              submittingText={isEditing ? "Updating..." : "Creating..."}
            />
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default UniversityFormModal;
