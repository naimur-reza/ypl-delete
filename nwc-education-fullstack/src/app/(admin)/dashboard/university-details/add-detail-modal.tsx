"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { SelectItem } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import z from "zod";

interface University {
  id: string;
  name: string;
}

interface UniversityDetail {
  id?: string;
  universityId: string;
  overview: string;
  ranking?: string | null;
  tuitionFees?: string | null;
  famousFor?: string | null;
  servicesHeading?: string | null;
  servicesDescription?: string | null;
  servicesImage?: string | null;
  entryRequirements: string;
  description?: string | null;
  accommodation?: string | null;
  accommodationImage?: string | null;
}

const detailSchema = z.object({
  universityId: z.string().min(1, "University is required"),
  overview: z.string().min(1, "Overview is required"),
  ranking: z.string().optional(),
  tuitionFees: z.string().optional(),
  famousFor: z.string().optional(),
  servicesHeading: z.string().optional(),
  servicesDescription: z.string().optional(),
  servicesImage: z.string().optional(),
  entryRequirements: z.string().min(1, "Entry requirements are required"),
  description: z.string().optional(),
  accommodation: z.string().optional(),
  accommodationImage: z.string().optional(),
});

type UniversityDetailFormValues = z.infer<typeof detailSchema>;

const UniversityDetailModal = ({
  isEditing,
  selectedDetail,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedDetail?: UniversityDetail;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [servicesImageUrl, setServicesImageUrl] = useState<string>(
    selectedDetail?.servicesImage || ""
  );
  const [accommodationImageUrl, setAccommodationImageUrl] = useState<string>(
    selectedDetail?.accommodationImage || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await apiClient.get<{ data: University[] }>(
          "/api/universities",
          { limit: "1000" }
        );
        if (response.data) {
          setUniversities(
            Array.isArray(response.data)
              ? response.data
              : response.data.data || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  const getDefaultValues: UniversityDetailFormValues = useMemo(
    () => ({
      universityId: selectedDetail?.universityId || "",
      overview: selectedDetail?.overview || "",
      ranking: selectedDetail?.ranking || "",
      tuitionFees: selectedDetail?.tuitionFees || "",
      famousFor: selectedDetail?.famousFor || "",
      servicesHeading: selectedDetail?.servicesHeading || "",
      servicesDescription: selectedDetail?.servicesDescription || "",
      servicesImage: selectedDetail?.servicesImage || "",
      entryRequirements: selectedDetail?.entryRequirements || "",
      description: selectedDetail?.description || "",
      accommodation: selectedDetail?.accommodation || "",
      accommodationImage: selectedDetail?.accommodationImage || "",
    }),
    [selectedDetail]
  );

  const toNullable = (value?: string) =>
    value && value.trim().length > 0 ? value.trim() : null;

  const form = useAppForm({
    defaultValues: getDefaultValues,
    validators: { onSubmit: detailSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const endpoint = "/api/university-details";
        let response;
        const payload = {
          ...value,
          overview: value.overview.trim(),
          entryRequirements: value.entryRequirements.trim(),
          ranking: toNullable(value.ranking),
          tuitionFees: toNullable(value.tuitionFees),
          famousFor: toNullable(value.famousFor),
          servicesHeading: toNullable(value.servicesHeading),
          servicesDescription: toNullable(value.servicesDescription),
          servicesImage: toNullable(servicesImageUrl),
          description: toNullable(value.description),
          accommodation: toNullable(value.accommodation),
          accommodationImage: toNullable(accommodationImageUrl),
        };

        if (isEditing && selectedDetail?.id) {
          response = await apiClient.put(endpoint, {
            id: selectedDetail.id,
            ...payload,
          });
        } else {
          response = await apiClient.post(endpoint, payload);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "University detail updated successfully"
            : "University detail created successfully"
        );
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
    form.reset(getDefaultValues);
    // Sync derived images from selected detail; safe to set state after reset
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setServicesImageUrl(selectedDetail?.servicesImage || "");

    setAccommodationImageUrl(selectedDetail?.accommodationImage || "");
  }, [getDefaultValues, form, selectedDetail]);

  return (
    <Modal
      isOpen
      title={isEditing ? "Edit University Detail" : "Add University Detail"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <FieldGroup>
              <form.AppField name="universityId">
                {(field) => (
                  <field.Select label="University">
                    {universities.length === 0 ? (
                      <SelectItem value="__loading__" disabled>
                        Loading universities...
                      </SelectItem>
                    ) : (
                      universities.map((uni) => (
                        <SelectItem key={uni.id} value={uni.id}>
                          {uni.name}
                        </SelectItem>
                      ))
                    )}
                  </field.Select>
                )}
              </form.AppField>

              <form.AppField name="overview">
                {(field) => (
                  <field.RichText
                    label="Overview"
                    placeholder="Enter university overview..."
                  />
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <field.RichText
                    label="Description"
                    placeholder="Enter detailed description..."
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </TabsContent>

          {/* Academic Info Tab */}
          <TabsContent value="academic" className="space-y-4">
            <FieldGroup>
              <form.AppField name="ranking">
                {(field) => <field.RichText label="Ranking" />}
              </form.AppField>

              <form.AppField name="famousFor">
                {(field) => <field.RichText label="Famous For" />}
              </form.AppField>

              <form.AppField name="tuitionFees">
                {(field) => <field.RichText label="Tuition Fees" />}
              </form.AppField>
            </FieldGroup>
          </TabsContent>

          {/* Admissions Tab */}
          <TabsContent value="admissions" className="space-y-4">
            <FieldGroup>
              <form.AppField name="entryRequirements">
                {(field) => (
                  <field.RichText
                    label="Entry Requirements"
                    placeholder="Enter university entry requirements..."
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </TabsContent>

          {/* Accommodation Tab */}
          <TabsContent value="accommodation" className="space-y-4">
            <FieldGroup>
              <form.AppField name="accommodation">
                {(field) => (
                  <field.RichText
                    label="Accommodation"
                    placeholder="Enter accommodation information..."
                  />
                )}
              </form.AppField>

              <ImageUpload
                value={accommodationImageUrl}
                onChange={setAccommodationImageUrl}
                folder="university-details"
                label="Accommodation Image"
                onUploadingChange={setIsUploading}
              />

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-lg font-semibold mb-4">Services</h3>

                <form.AppField name="servicesHeading">
                  {(field) => <field.Input label="Services Heading" />}
                </form.AppField>

                <form.AppField name="servicesDescription">
                  {(field) => (
                    <field.RichText
                      label="Services Description"
                      placeholder="Enter services description..."
                    />
                  )}
                </form.AppField>

                <ImageUpload
                  value={servicesImageUrl}
                  onChange={setServicesImageUrl}
                  folder="university-details"
                  label="Services Image"
                  onUploadingChange={setIsUploading}
                />
              </div>
            </FieldGroup>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-slate-200">
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
      </form>
    </Modal>
  );
};

export default UniversityDetailModal;
