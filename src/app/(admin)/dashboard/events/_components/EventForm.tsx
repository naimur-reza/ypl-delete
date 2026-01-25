"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { eventSchema } from "@/schemas/event";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/region-select";
import { SelectItem } from "@/components/ui/select";

import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";
import MultiSelect from "@/components/ui/multi-select";
import { Event } from "../../../../../../prisma/src/generated/prisma/browser";

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

interface EventFormProps {
  event?: Event & {
    countries?: Array<{ country?: { id: string }; countryId?: string }>;
    destinations?: Array<{ destinationId: string }>;
  };
  onSuccess?: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!event;
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [countryIds, setCountryIds] = useState<string[]>(
    (
      event?.countries?.map(
        (r: { country?: { id: string }; countryId?: string }) =>
          r.country?.id || r.countryId || ""
      ) || []
    ).filter((id) => id !== "")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGlobal, setIsGlobal] = useState<boolean>((event as any)?.isGlobal || false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    event?.destinations?.length
      ? event.destinations.map((d) => d.destinationId)
      : event?.destinationId
      ? [event.destinationId]
      : []
  );
  const [bannerUrl, setBannerUrl] = useState<string>(event?.banner || "");

  // Check if event has passed
  const isEventPast = event?.endDate
    ? new Date(event.endDate) < new Date()
    : event?.startDate
    ? new Date(event.startDate) < new Date()
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
      title: event?.title || "",
      slug: event?.slug || "",
      description: event?.description || "",
      eventType:
        (event?.eventType as
          | "EXPO"
          | "WEBINAR"
          | "ADMISSION_DAY"
          | "OPEN_DAY"
          | "SEMINAR"
          | "WORKSHOP") || "WEBINAR",
      startDate: event?.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "",
      endDate: event?.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "",
      location: event?.location || "",
      city: (event)?.city || "",
      isFeatured: event?.isFeatured ?? false,
      destinationIds: selectedDestinations,
      universityId: event?.universityId || "",
      countryIds: countryIds,
      video: event?.video || "",
      gallery: event?.gallery || [],
      successSummary: event?.successSummary || "",
      metaTitle: event?.metaTitle || "",
      metaDescription: event?.metaDescription || "",
      metaKeywords: event?.metaKeywords || "",
      status: event?.status || "DRAFT",
      isGlobal: (event as any)?.isGlobal || false,
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
          countryIds: isGlobal ? [] : countryIds,
          isGlobal: isGlobal,
          destinationIds: value.destinationIds,
          city: value.city || null,
          banner: bannerUrl || null,
          video: value.video && value.video.trim() !== "" ? value.video : null,
          gallery: value.gallery || [],
          successSummary: value.successSummary || null,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
        };

        if (isEditing && event?.id) {
          response = await eventApi.update(event.id, submitData);
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
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/events"],
        });
        router.push("/dashboard/events");
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
    if (event) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = event as any;
      form.setFieldValue("title", e.title || "");
      form.setFieldValue("slug", e.slug || "");
      form.setFieldValue("description", e.description || "");
      form.setFieldValue(
        "eventType",
        (e.eventType as
          | "EXPO"
          | "WEBINAR"
          | "ADMISSION_DAY"
          | "OPEN_DAY"
          | "SEMINAR"
          | "WORKSHOP") || "WEBINAR"
      );
      form.setFieldValue(
        "startDate",
        e.startDate
          ? new Date(e.startDate).toISOString().slice(0, 16)
          : ""
      );
      form.setFieldValue(
        "endDate",
        e.endDate
          ? new Date(e.endDate).toISOString().slice(0, 16)
          : ""
      );
      form.setFieldValue("location", e.location || "");
      form.setFieldValue("city", e.city || "");
      form.setFieldValue("isFeatured", e.isFeatured ?? false);
      
      const destIds = e.destinations?.length
        ? e.destinations.map((d: any) => d.destinationId)
        : e.destinationId
        ? [e.destinationId]
        : [];
      
      setSelectedDestinations(destIds);
      form.setFieldValue("destinationIds", destIds);
      form.setFieldValue("universityId", e.universityId || "");
      
      const countries = e.countries || [];
      const initialCountryIds = countries
        .map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || ""
        )
        .filter((id: string) => id !== "");
      setCountryIds(initialCountryIds);
      setIsGlobal(e.isGlobal || false);
      form.setFieldValue("countryIds", initialCountryIds);
      
      form.setFieldValue("video", e.video || "");
      form.setFieldValue("gallery", e.gallery || []);
      form.setFieldValue("successSummary", e.successSummary || "");
      form.setFieldValue("metaTitle", e.metaTitle || "");
      form.setFieldValue("metaDescription", e.metaDescription || "");
      form.setFieldValue("metaKeywords", e.metaKeywords || "");
      form.setFieldValue("status", e.status || "DRAFT");
      setBannerUrl(e.banner || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  // Auto-slug generation from title
  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: !!isEditing,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
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
        <form.AppField name="status">
          {(field) => (
            <field.Select label="Status">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="destinationIds">
          {(field) => (
            <FormBase label="Destinations">
              <MultiSelect
                options={destinations.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                value={field.state.value || []}
                onChange={(vals) => {
                  setSelectedDestinations(vals);
                  field.handleChange(vals);
                }}
                placeholder="Select destinations..."
              />
            </FormBase>
          )}
        </form.AppField>
        <div className="mb-4">
          <ImageUpload
            value={bannerUrl}
            onChange={setBannerUrl}
            folder="events/banners"
            label="Event Banner"
            onUploadingChange={setIsUploading}
          />
        </div>
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
              showGlobalOption={true}
              isGlobal={isGlobal}
              onGlobalChange={(checked) => {
                setIsGlobal(checked);
                form.setFieldValue("isGlobal", checked);
                if (checked) {
                  setCountryIds([]);
                  field.handleChange([]);
                }
              }}
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
        <form.AppField name="city">
          {(field) => <field.Input label="City" />}
        </form.AppField>
        <form.AppField name="isFeatured">
          {(field) => <field.Checkbox label="Featured" />}
        </form.AppField>

        {/* Post-Event Content Section */}
        {isEventPast && (
          <>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-3">Post-Event Content</h3>
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
        <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/events")}
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
