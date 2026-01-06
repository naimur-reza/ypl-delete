"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { eventSchema } from "@/schemas/event";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { apiClient } from "@/lib/api-client";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/region-select";
import { SelectItem } from "@/components/ui/select";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

type FormData = z.infer<typeof eventSchema>;

const eventApi = createEntityApi<FormData & { id: string }>("/api/events");

interface Destination {
  id: string;
  name: string;
}

interface University {
  id: string;
  name: string;
}

const EventFormModal = ({
  isEditing,
  selectedEvent,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedEvent?: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    eventType: string;
    startDate: string;
    endDate?: string | null;
    location?: string | null;
    isFeatured?: boolean;
    destinationId: string;
    universityId?: string | null;
    countries?: Array<{ country?: { id: string }; countryId?: string }>;
    video?: string | null;
    gallery?: string[];
    successSummary?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  };
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [countryIds, setCountryIds] = useState<string[]>(
    (
      selectedEvent?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || ""
      ) || []
    ).filter((id) => id !== "")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Check if event has passed
  const isEventPast = selectedEvent?.endDate
    ? new Date(selectedEvent.endDate) < new Date()
    : selectedEvent?.startDate
    ? new Date(selectedEvent.startDate) < new Date()
    : false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, uniRes] = await Promise.all([
          apiClient.get<{ data: Destination[] }>("/api/destinations", {
            limit: "1000",
          }),
          apiClient.get<{ data: University[] }>("/api/universities", {
            limit: "1000",
          }),
        ]);

        if (destRes.data) {
          setDestinations(
            Array.isArray(destRes.data) ? destRes.data : destRes.data.data || []
          );
        }
        if (uniRes.data) {
          setUniversities(
            Array.isArray(uniRes.data) ? uniRes.data : uniRes.data.data || []
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
      title: selectedEvent?.title || "",
      slug: selectedEvent?.slug || "",
      description: selectedEvent?.description || "",
      eventType:
        (selectedEvent?.eventType as
          | "EXPO"
          | "WEBINAR"
          | "ADMISSION_DAY"
          | "OPEN_DAY"
          | "SEMINAR"
          | "WORKSHOP") || "WEBINAR",
      startDate: selectedEvent?.startDate
        ? new Date(selectedEvent.startDate).toISOString().slice(0, 16)
        : "",
      endDate: selectedEvent?.endDate
        ? new Date(selectedEvent.endDate).toISOString().slice(0, 16)
        : "",
      location: selectedEvent?.location || "",
      isFeatured: selectedEvent?.isFeatured ?? false,
      destinationId: selectedEvent?.destinationId || "",
      universityId: selectedEvent?.universityId || "",
      countryIds: countryIds,
      video: selectedEvent?.video || "",
      gallery: selectedEvent?.gallery || [],
      successSummary: selectedEvent?.successSummary || "",
      metaTitle: selectedEvent?.metaTitle || "",
      metaDescription: selectedEvent?.metaDescription || "",
      metaKeywords: selectedEvent?.metaKeywords || "",
    } satisfies FormData as FormData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validators: { onSubmit: eventSchema as any },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        let response;
        const submitData = {
          ...value,
          endDate: value.endDate || null,
          universityId: value.universityId || null,
          countryIds: countryIds,
          video: value.video && value.video.trim() !== "" ? value.video : null,
          gallery: value.gallery || [],
          successSummary: value.successSummary || null,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
        };

        if (isEditing && selectedEvent?.id) {
          response = await eventApi.update(selectedEvent.id, submitData);
        } else {
          response = await eventApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Event updated successfully"
            : "Event created successfully"
        );
        form.reset();
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
    if (selectedEvent) {
      form.setFieldValue("title", selectedEvent.title || "");
      form.setFieldValue("slug", selectedEvent.slug || "");
      form.setFieldValue("description", selectedEvent.description || "");
      form.setFieldValue(
        "eventType",
        selectedEvent.eventType as
          | "EXPO"
          | "WEBINAR"
          | "ADMISSION_DAY"
          | "OPEN_DAY"
          | "SEMINAR"
          | "WORKSHOP"
      );
      form.setFieldValue(
        "startDate",
        selectedEvent.startDate
          ? new Date(selectedEvent.startDate).toISOString().slice(0, 16)
          : ""
      );
      form.setFieldValue(
        "endDate",
        selectedEvent.endDate
          ? new Date(selectedEvent.endDate).toISOString().slice(0, 16)
          : ""
      );
      form.setFieldValue("location", selectedEvent.location || "");
      form.setFieldValue("isFeatured", selectedEvent.isFeatured ?? false);
      form.setFieldValue("destinationId", selectedEvent.destinationId || "");
      form.setFieldValue("universityId", selectedEvent.universityId || "");
      const countries = selectedEvent.countries || [];
      const initialCountryIds = countries
        .map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || ""
        )
        .filter((id) => id !== "");
      setCountryIds(initialCountryIds);
      form.setFieldValue("countryIds", initialCountryIds);
      form.setFieldValue("video", selectedEvent.video || "");
      form.setFieldValue("gallery", selectedEvent.gallery || []);
      form.setFieldValue("successSummary", selectedEvent.successSummary || "");
      form.setFieldValue("metaTitle", selectedEvent.metaTitle || "");
      form.setFieldValue(
        "metaDescription",
        selectedEvent.metaDescription || ""
      );
      form.setFieldValue("metaKeywords", selectedEvent.metaKeywords || "");
    } else {
      form.reset();
      setCountryIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent]);

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Event" : "Add Event"}
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
          <form.AppField name="eventType">
            {(field) => (
              <field.Select label="Event Type">
                <SelectItem value="EXPO">Expo</SelectItem>
                <SelectItem value="WEBINAR">Webinar</SelectItem>
                <SelectItem value="ADMISSION_DAY">Admission Day</SelectItem>
                <SelectItem value="OPEN_DAY">Open Day</SelectItem>
                <SelectItem value="SEMINAR">Seminar</SelectItem>
                <SelectItem value="WORKSHOP">Workshop</SelectItem>
              </field.Select>
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
          <form.AppField name="description">
            {(field) => (
              <field.RichText
                label="Description"
                placeholder="Enter event description..."
              />
            )}
          </form.AppField>
          <form.AppField name="startDate">
            {(field) => (
              <FormBase label="Start Date">
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
          <form.AppField name="endDate">
            {(field) => (
              <FormBase label="End Date (Optional)">
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
          <form.AppField name="location">
            {(field) => <field.Input label="Location" />}
          </form.AppField>
          <form.AppField name="isFeatured">
            {(field) => <field.Checkbox label="Featured" />}
          </form.AppField>

          {/* Post-Event Content Section */}
          {isEventPast && (
            <>
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Post-Event Content
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This event has ended. You can now add post-event content.
                </p>
              </div>

              <form.AppField name="video">
                {(field) => (
                  <field.Input
                    label="Event Video URL (Optional)"
                    placeholder="https://youtube.com/..."
                  />
                )}
              </form.AppField>

              <form.AppField name="gallery">
                {(field) => (
                  <MultipleImageUpload
                    value={field.state.value as string[]}
                    onChange={(urls) => field.handleChange(urls)}
                    folder="events"
                    label="Photo Gallery"
                    maxImages={20}
                    onUploadingChange={setIsUploading}
                  />
                )}
              </form.AppField>

              <form.AppField name="successSummary">
                {(field) => (
                  <field.Textarea
                    label="Event Success Summary (Optional)"
                    placeholder="Describe the event outcomes, attendance, highlights..."
                  />
                )}
              </form.AppField>
            </>
          )}
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isUploading ? "Uploading..." : isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default EventFormModal;
