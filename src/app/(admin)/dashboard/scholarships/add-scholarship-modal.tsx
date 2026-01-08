"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { scholarshipSchema } from "@/schemas/scholarship";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { apiClient } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { SelectItem } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FormData = z.infer<typeof scholarshipSchema>;

const scholarshipApi = createEntityApi<FormData & { id: string }>(
  "/api/scholarships"
);

interface University {
  id: string;
  name: string;
}

interface Destination {
  id: string;
  name: string;
}

const ScholarshipFormModal = ({
  isEditing,
  selectedScholarship,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedScholarship?: {
    id: string;
    title: string;
    slug: string;
    image?: string | null;
    description?: string | null;
    summary?: string | null;
    amount?: number | null;
    eligibility?: string | null;
    deadline?: string | null;
    universityId?: string | null;
    destinationId: string;
    isActive?: boolean;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
    overview?: string | null;
    benefits?: string | null;
    eligibilityCriteria?: string | null;
    levelAndField?: string | null;
    providerInfo?: string | null;
    requiredDocuments?: string | null;
    howToApply?: string | null;
  };
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [universities, setUniversities] = useState<University[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(
    selectedScholarship?.image || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uniRes, destRes] = await Promise.all([
          apiClient.get<{ data: University[] }>("/api/universities", {
            limit: "1000",
          }),
          apiClient.get<{ data: Destination[] }>("/api/destinations", {
            limit: "1000",
          }),
        ]);

        if (uniRes.data) {
          setUniversities(
            Array.isArray(uniRes.data) ? uniRes.data : uniRes.data.data || []
          );
        }
        if (destRes.data) {
          setDestinations(
            Array.isArray(destRes.data) ? destRes.data : destRes.data.data || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const form = useAppForm({
    defaultValues: {
      title: selectedScholarship?.title || "",
      slug: selectedScholarship?.slug || "",
      description: selectedScholarship?.description || "",
      summary: selectedScholarship?.summary || "",
      isActive: selectedScholarship?.isActive ?? true,
      amount: selectedScholarship?.amount?.toString() || "",
      deadline: selectedScholarship?.deadline
        ? new Date(selectedScholarship.deadline).toISOString().slice(0, 16)
        : "",
      universityId: selectedScholarship?.universityId || "",
      destinationId: selectedScholarship?.destinationId || "",
      metaTitle: selectedScholarship?.metaTitle || "",
      metaDescription: selectedScholarship?.metaDescription || "",
      metaKeywords: selectedScholarship?.metaKeywords || "",
      overview: selectedScholarship?.overview || "",
      benefits: selectedScholarship?.benefits || "",
      eligibilityCriteria: selectedScholarship?.eligibilityCriteria || "",
      levelAndField: selectedScholarship?.levelAndField || "",
      providerInfo: selectedScholarship?.providerInfo || "",
      requiredDocuments: selectedScholarship?.requiredDocuments || "",
      howToApply: selectedScholarship?.howToApply || "",
    } satisfies Partial<FormData> as Partial<FormData>,
    validators: { onSubmit: scholarshipSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const submitData: any = {
          ...value,
          image: imageUrl || null,
          summary: value.summary || null,
          isActive: value.isActive ?? true,
          amount: value.amount ? parseFloat(value.amount) : null,
          deadline: value.deadline || null,
          universityId: value.universityId || null,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
          overview: value.overview || null,
          benefits: value.benefits || null,
          eligibilityCriteria: value.eligibilityCriteria || null,
          levelAndField: value.levelAndField || null,
          providerInfo: value.providerInfo || null,
          requiredDocuments: value.requiredDocuments || null,
          howToApply: value.howToApply || null,
        };

        if (isEditing && selectedScholarship?.id) {
          response = await scholarshipApi.update(
            selectedScholarship.id,
            submitData
          );
        } else {
          response = await scholarshipApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Scholarship updated successfully"
            : "Scholarship created successfully"
        );
        form.reset();
        setImageUrl("");
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
    if (selectedScholarship) {
      form.setFieldValue("title", selectedScholarship.title || "");
      form.setFieldValue("slug", selectedScholarship.slug || "");
      form.setFieldValue("description", selectedScholarship.description || "");
      form.setFieldValue("summary", selectedScholarship.summary || "");
      form.setFieldValue("isActive", selectedScholarship.isActive ?? true);
      if (
        selectedScholarship.amount !== undefined &&
        selectedScholarship.amount !== null
      ) {
        form.setFieldValue("amount", selectedScholarship.amount.toString());
      }
      form.setFieldValue(
        "deadline",
        selectedScholarship.deadline
          ? new Date(selectedScholarship.deadline).toISOString().slice(0, 16)
          : ""
      );
      form.setFieldValue(
        "universityId",
        selectedScholarship.universityId || ""
      );
      form.setFieldValue(
        "destinationId",
        selectedScholarship.destinationId || ""
      );
      form.setFieldValue("metaTitle", selectedScholarship.metaTitle || "");
      form.setFieldValue(
        "metaDescription",
        selectedScholarship.metaDescription || ""
      );
      form.setFieldValue(
        "metaKeywords",
        selectedScholarship.metaKeywords || ""
      );
      form.setFieldValue("overview", selectedScholarship.overview || "");
      form.setFieldValue("benefits", selectedScholarship.benefits || "");
      form.setFieldValue(
        "eligibilityCriteria",
        selectedScholarship.eligibilityCriteria || ""
      );
      form.setFieldValue(
        "levelAndField",
        selectedScholarship.levelAndField || ""
      );
      form.setFieldValue(
        "providerInfo",
        selectedScholarship.providerInfo || ""
      );
      form.setFieldValue(
        "requiredDocuments",
        selectedScholarship.requiredDocuments || ""
      );
      form.setFieldValue("howToApply", selectedScholarship.howToApply || "");
      setImageUrl(selectedScholarship.image || "");
    } else {
      form.reset();
      setImageUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScholarship]);

  // Auto-slug generation from title
  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: !!isEditing,
  });

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Scholarship" : "Add Scholarship"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
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
                      placeholder="e.g., Merit Scholarship 2025"
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
                      placeholder="e.g., merit-scholarship-2025"
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
              <form.AppField name="universityId">
                {(field) => (
                  <field.Select label="University (Optional)">
                    {universities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </field.Select>
                )}
              </form.AppField>
              <form.AppField name="description">
                {(field) => <field.Textarea label="Description" />}
              </form.AppField>
              <form.AppField name="summary">
                {(field) => <field.Input label="Summary (for cards/lists)" />}
              </form.AppField>
              <form.AppField name="isActive">
                {(field) => <field.Checkbox label="Active" />}
              </form.AppField>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                folder="scholarships"
                label="Scholarship Image"
                onUploadingChange={setIsUploading}
              />
              <form.AppField name="amount">
                {(field) => (
                  <FormBase label="Amount (USD)">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      step="0.01"
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
            </TabsContent>

            {/* Details Tab with Sub-Tabs */}
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Scholarship Details</h3>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
                    <TabsTrigger value="overview" className="text-xs">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="benefits" className="text-xs">
                      Benefits
                    </TabsTrigger>
                    <TabsTrigger value="eligibility" className="text-xs">
                      Eligibility
                    </TabsTrigger>
                    <TabsTrigger value="level" className="text-xs">
                      Level & Field
                    </TabsTrigger>
                    <TabsTrigger value="provider" className="text-xs">
                      Provider
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs">
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="apply" className="text-xs">
                      How to Apply
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4">
                    <form.AppField name="overview">
                      {(field) => (
                        <field.RichText
                          label="Overview / About the Scholarship"
                          placeholder="Enter scholarship overview and description..."
                        />
                      )}
                    </form.AppField>
                  </TabsContent>

                  <TabsContent value="benefits" className="mt-4">
                    <form.AppField name="benefits">
                      {(field) => (
                        <field.RichText
                          label="Scholarship Value / Benefits"
                          placeholder="Enter scholarship benefits and value..."
                        />
                      )}
                    </form.AppField>
                  </TabsContent>

                  <TabsContent value="eligibility" className="mt-4">
                    <form.AppField name="eligibilityCriteria">
                      {(field) => (
                        <field.RichText
                          label="Eligibility Criteria"
                          placeholder="Enter detailed eligibility criteria..."
                        />
                      )}
                    </form.AppField>
                  </TabsContent>

                  <TabsContent value="level" className="mt-4">
                    <form.AppField name="levelAndField">
                      {(field) => (
                        <field.RichText
                          label="Level & Field of Study"
                          placeholder="Enter level and field of study information..."
                        />
                      )}
                    </form.AppField>
                  </TabsContent>

                  <TabsContent value="provider" className="mt-4">
                    <form.AppField name="providerInfo">
                      {(field) => (
                        <field.RichText
                          label="Host University / Provider Info"
                          placeholder="Enter host university or provider information..."
                        />
                      )}
                    </form.AppField>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-4">
                    <form.AppField name="requiredDocuments">
                      {(field) => (
                        <field.RichText
                          label="Required Documents"
                          placeholder="Enter list of required documents..."
                        />
                      )}
                    </form.AppField>
                  </TabsContent>

                  <TabsContent value="apply" className="mt-4">
                    <form.AppField name="howToApply">
                      {(field) => (
                        <field.RichText
                          label="How to Apply"
                          placeholder="Enter application process and instructions..."
                        />
                      )}
                    </form.AppField>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <form.AppField name="metaTitle">
                {(field) => <field.Input label="Meta Title" />}
              </form.AppField>
              <form.AppField name="metaDescription">
                {(field) => <field.Textarea label="Meta Description" />}
              </form.AppField>
              <form.AppField name="metaKeywords">
                {(field) => <field.Input label="Meta Keywords" />}
              </form.AppField>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-end mt-6">
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

export default ScholarshipFormModal;
