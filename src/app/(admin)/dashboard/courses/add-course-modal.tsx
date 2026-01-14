"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { courseSchema } from "@/schemas/course";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import {
  Course,
  University,
  Destination,
} from "../../../../../prisma/src/generated/prisma/browser";
import { SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormBase } from "@/components/form/FormBase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FormData = z.infer<typeof courseSchema>;
type CourseSections = {
  overview: string;
  entryRequirements: string;
  costOfStudy: string;
  scholarships: string;
  careers: string;
  admission: string;
};

// Extend Course type to include sections as a typed object
type CourseWithSections = Course & {
  sections?: CourseSections | null;
};

const courseApi = createEntityApi<Course>("/api/courses");

const CourseFormModal = ({
  isEditing,
  selectedCourse,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedCourse?: CourseWithSections;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [universities, setUniversities] = useState<
    Pick<University, "id" | "name">[]
  >([]);
  const [destinations, setDestinations] = useState<
    Pick<Destination, "id" | "name">[]
  >([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoadingUniversities(true);
      try {
        const response = await apiClient.get<{
          data: Pick<University, "id" | "name">[];
        }>("/api/universities", { limit: 1000 });
        if (response.data) {
          const data = Array.isArray(response.data)
            ? response.data
            : response.data.data || [];
          setUniversities(data);
        }
      } catch (err) {
        console.error("Failed to fetch universities:", err);
      } finally {
        setLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoadingDestinations(true);
      try {
        const response = await apiClient.get<{
          data: Pick<Destination, "id" | "name">[];
        }>("/api/destinations", { limit: 1000 });
        if (response.data) {
          const data = Array.isArray(response.data)
            ? response.data
            : response.data.data || [];
          setDestinations(data);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  const getDefaultSections = (): CourseSections => ({
    overview: "",
    entryRequirements: "",
    costOfStudy: "",
    scholarships: "",
    careers: "",
    admission: "",
  });

  const form = useAppForm({
    defaultValues: {
      title: selectedCourse?.title || "",
      slug: selectedCourse?.slug || "",
      description: selectedCourse?.description || "",
      summary: selectedCourse?.summary || "",
      icon: selectedCourse?.icon || "",
      duration: selectedCourse?.duration || "",
      studyLevel: selectedCourse?.studyLevel || null,
      faculty: selectedCourse?.faculty || null,
      tuitionMin: selectedCourse?.tuitionMin || null,
      tuitionMax: selectedCourse?.tuitionMax || null,
      currency: selectedCourse?.currency || "USD",
      isFeatured: selectedCourse?.isFeatured ?? false,
      status: selectedCourse?.status || "DRAFT",
      universityId: selectedCourse?.universityId || "",
      destinationId: selectedCourse?.destinationId || "",
      metaTitle: selectedCourse?.metaTitle || "",
      metaDescription: selectedCourse?.metaDescription || "",
      metaKeywords: selectedCourse?.metaKeywords || "",
      sections: selectedCourse?.sections || getDefaultSections(),
    } satisfies FormData as FormData,
    validators: { onSubmit: courseSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          description: value.description || null,
          summary: value.summary || null,
          icon: value.icon || null,
          duration: value.duration || null,
          studyLevel: value.studyLevel || null,
          faculty: value.faculty || null,
          tuitionMin: value.tuitionMin || null,
          tuitionMax: value.tuitionMax || null,
          currency: value.currency || "USD",
          isFeatured: value.isFeatured ?? false,
          status: value.status || "DRAFT",
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
          sections: value.sections || null,
        };

        if (isEditing && selectedCourse?.id) {
          response = await courseApi.update(selectedCourse.id, submitData);
        } else {
          response = await courseApi.create({
            ...submitData,
            createdBy: null,
            updatedBy: null,
          });
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Course updated successfully"
            : "Course created successfully"
        );
        form.reset();
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
    if (!selectedCourse) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  // Auto-slug generation from title
  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: !!isEditing,
  });

  return (
    <Modal
      isOpen={true}
      title={isEditing ? "Edit Course" : "Add Course"}
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
          <form.AppField name="description">
            {(field) => <field.Textarea label="Description" />}
          </form.AppField>
          <form.AppField name="summary">
            {(field) => <field.Input label="Summary (for cards)" />}
          </form.AppField>
          <form.AppField name="icon">
            {(field) => (
              <field.Select label="Icon">
                <SelectItem value="Briefcase">Briefcase (Business)</SelectItem>
                <SelectItem value="Code">Code (IT/Computer Science)</SelectItem>
                <SelectItem value="Microscope">
                  Microscope (Engineering)
                </SelectItem>
                <SelectItem value="Stethoscope">
                  Stethoscope (Medicine)
                </SelectItem>
                <SelectItem value="Palette">Palette (Arts & Design)</SelectItem>
                <SelectItem value="Scale">Scale (Law)</SelectItem>
                <SelectItem value="BookOpen">
                  BookOpen (Social Sciences)
                </SelectItem>
                <SelectItem value="FlaskConical">
                  FlaskConical (Sciences)
                </SelectItem>
                <SelectItem value="GraduationCap">
                  GraduationCap (Education)
                </SelectItem>
                <SelectItem value="Building2">
                  Building2 (Architecture)
                </SelectItem>
                <SelectItem value="Calculator">
                  Calculator (Mathematics)
                </SelectItem>
                <SelectItem value="Music">Music (Music/Arts)</SelectItem>
                <SelectItem value="Globe">Globe (International)</SelectItem>
                <SelectItem value="Heart">Heart (Healthcare)</SelectItem>
                <SelectItem value="Lightbulb">
                  Lightbulb (Innovation)
                </SelectItem>
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="duration">
            {(field) => <field.Input label="Duration" />}
          </form.AppField>
          <form.AppField name="tuitionMin">
            {(field) => {
              return (
                <FormBase label="Minimum Tuition">
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;
                      field.handleChange(val ? parseFloat(val) : null);
                    }}
                    onBlur={field.handleBlur}
                    value={field.state.value?.toString() ?? ""}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  />
                </FormBase>
              );
            }}
          </form.AppField>
          <form.AppField name="tuitionMax">
            {(field) => {
              return (
                <FormBase label="Maximum Tuition">
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;
                      field.handleChange(val ? parseFloat(val) : null);
                    }}
                    onBlur={field.handleBlur}
                    value={field.state.value?.toString() ?? ""}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  />
                </FormBase>
              );
            }}
          </form.AppField>
          <form.AppField name="currency">
            {(field) => <field.Input label="Currency" />}
          </form.AppField>
          <form.AppField name="universityId">
            {(field) => (
              <field.Select label="University">
                {loadingUniversities ? (
                  <SelectItem value="__loading__" disabled>
                    Loading...
                  </SelectItem>
                ) : universities.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    No universities available
                  </SelectItem>
                ) : (
                  universities.map((university) => (
                    <SelectItem key={university.id} value={university.id}>
                      {university.name}
                    </SelectItem>
                  ))
                )}
              </field.Select>
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
          <form.AppField name="duration">
            {(field) => (
              <field.Input
                label="Duration"
        
              />
            )}
          </form.AppField>
          <form.AppField name="studyLevel">
            {(field) => (
              <field.Select label="Study Level">
                <SelectItem value="FOUNDATION">Foundation</SelectItem>
                <SelectItem value="BACHELOR">Bachelor's Degree</SelectItem>
                <SelectItem value="MASTER">Master's Degree</SelectItem>
                <SelectItem value="PHD">PhD / Doctorate</SelectItem>
                <SelectItem value="DIPLOMA">Diploma</SelectItem>
                <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                <SelectItem value="PATHWAY">Pathway Program</SelectItem>
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="faculty">
            {(field) => (
              <field.Select label="Faculty / Subject Area">
                <SelectItem value="ENGINEERING">Engineering</SelectItem>
                <SelectItem value="BUSINESS">Business & Management</SelectItem>
                <SelectItem value="ARTS_HUMANITIES">
                  Arts & Humanities
                </SelectItem>
                <SelectItem value="SCIENCE">Science</SelectItem>
                <SelectItem value="MEDICINE_HEALTH">
                  Medicine & Health
                </SelectItem>
                <SelectItem value="LAW">Law</SelectItem>
                <SelectItem value="EDUCATION">Education</SelectItem>
                <SelectItem value="SOCIAL_SCIENCES">Social Sciences</SelectItem>
                <SelectItem value="IT_COMPUTING">IT & Computing</SelectItem>
                <SelectItem value="ARCHITECTURE">
                  Architecture & Design
                </SelectItem>
                <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
                <SelectItem value="HOSPITALITY_TOURISM">
                  Hospitality & Tourism
                </SelectItem>
                <SelectItem value="MEDIA_COMMUNICATION">
                  Media & Communication
                </SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </field.Select>
            )}
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

          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Course Details</h3>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="cost">Cost & Aid</TabsTrigger>
                <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
                <TabsTrigger value="careers">Careers</TabsTrigger>
                <TabsTrigger value="admission">Admission</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <form.AppField name="sections.overview">
                  {(field) => (
                    <field.RichText
                      label="Course Overview"
                      placeholder="Enter course overview..."
                    />
                  )}
                </form.AppField>
              </TabsContent>
              <TabsContent value="requirements" className="mt-4">
                <form.AppField name="sections.entryRequirements">
                  {(field) => (
                    <field.RichText
                      label="Entry Requirements"
                      placeholder="Enter entry requirements..."
                    />
                  )}
                </form.AppField>
              </TabsContent>
              <TabsContent value="cost" className="mt-4">
                <form.AppField name="sections.costOfStudy">
                  {(field) => (
                    <field.RichText
                      label="Cost of Study"
                      placeholder="Enter cost details..."
                    />
                  )}
                </form.AppField>
              </TabsContent>
              <TabsContent value="scholarships" className="mt-4">
                <form.AppField name="sections.scholarships">
                  {(field) => (
                    <field.RichText
                      label="Scholarships"
                      placeholder="Enter scholarship details..."
                    />
                  )}
                </form.AppField>
              </TabsContent>
              <TabsContent value="careers" className="mt-4">
                <form.AppField name="sections.careers">
                  {(field) => (
                    <field.RichText
                      label="Career Opportunities"
                      placeholder="Enter career prospects..."
                    />
                  )}
                </form.AppField>
              </TabsContent>
              <TabsContent value="admission" className="mt-4">
                <form.AppField name="sections.admission">
                  {(field) => (
                    <field.RichText
                      label="Admission Process"
                      placeholder="Enter admission process..."
                    />
                  )}
                </form.AppField>
              </TabsContent>
            </Tabs>
          </div>
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
              submitText={isEditing ? "Update" : "Create"}
              submittingText={isEditing ? "Updating..." : "Creating..."}
            />
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default CourseFormModal;
