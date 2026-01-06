"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { testimonialSchema } from "@/schemas/testimonial";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { CountrySelect } from "@/components/ui/region-select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FormData = z.infer<typeof testimonialSchema>;

const testimonialApi = createEntityApi<{ id: string }>("/api/testimonials");

interface TestimonialFormModalProps {
  isEditing?: boolean;
  selectedTestimonial?: {
    id: string;
    type: "STUDENT" | "REPRESENTATIVE" | "GMB";
    mediaType: "IMAGE" | "VIDEO" | "TEXT_ONLY";
    name: string;
    role?: string | null;
    content?: string | null;
    rating?: number | null;
    avatar?: string | null;
    videoUrl?: string | null;
    url?: string | null;
    isFeatured: boolean;
    order: number;
    countries?: Array<{ countryId: string }>;
    destinations?: Array<{ destinationId: string }>;
    universities?: Array<{ universityId: string }>;
    events?: Array<{ eventId: string }>;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

interface Entity {
  id: string;
  name?: string;
  title?: string;
}

const TestimonialFormModal = ({
  isEditing,
  selectedTestimonial,
  onClose,
  onSuccess,
}: TestimonialFormModalProps) => {
  const isOpen = true;
  
  // State for multi-select fields
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [destinationIds, setDestinationIds] = useState<string[]>([]);
  const [universityIds, setUniversityIds] = useState<string[]>([]);
  const [eventIds, setEventIds] = useState<string[]>([]);
  
  // Entity lists for selection
  const [destinations, setDestinations] = useState<Entity[]>([]);
  const [universities, setUniversities] = useState<Entity[]>([]);
  const [events, setEvents] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Local state for conditional rendering (replaces useStore)
  const [type, setType] = useState<"STUDENT" | "REPRESENTATIVE" | "GMB">(
    selectedTestimonial?.type || "STUDENT"
  );
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO" | "TEXT_ONLY">(
    selectedTestimonial?.mediaType || "TEXT_ONLY"
  );

  // Fetch entities
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const [destRes, uniRes, eventRes] = await Promise.all([
          apiClient.get<Entity[]>("/api/destinations"),
          apiClient.get<Entity[]>("/api/universities"),
          apiClient.get<Entity[]>("/api/events"),
        ]);
        
        // Handle both array and paginated responses
        setDestinations(Array.isArray(destRes.data) ? destRes.data : (destRes.data as any)?.data || []);
        setUniversities(Array.isArray(uniRes.data) ? uniRes.data : (uniRes.data as any)?.data || []);
        setEvents(Array.isArray(eventRes.data) ? eventRes.data : (eventRes.data as any)?.data || []);
      } catch (error) {
        console.error("Failed to fetch entities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);

  const form = useAppForm({
    defaultValues: {
      type: selectedTestimonial?.type || "STUDENT",
      mediaType: selectedTestimonial?.mediaType || "TEXT_ONLY",
      name: selectedTestimonial?.name || "",
      role: selectedTestimonial?.role || "",
      content: selectedTestimonial?.content || "",
      rating: selectedTestimonial?.rating || 5,
      avatar: selectedTestimonial?.avatar || "",
      videoUrl: selectedTestimonial?.videoUrl || "",
      url: selectedTestimonial?.url || "",
      isFeatured: selectedTestimonial?.isFeatured || false,
      order: selectedTestimonial?.order || 0,
      countryIds: selectedTestimonial?.countries?.map((c) => c.countryId) || [],
      destinationIds: selectedTestimonial?.destinations?.map((d) => d.destinationId) || [],
      universityIds: selectedTestimonial?.universities?.map((u) => u.universityId) || [],
      eventIds: selectedTestimonial?.events?.map((e) => e.eventId) || [],
    } satisfies FormData as FormData,
    validators: { onSubmit: testimonialSchema as any },
    onSubmit: async ({ value }) => {
      try {
        let response;
        const submitData = {
          ...value,
          countryIds,
          destinationIds,
          universityIds,
          eventIds,
          role: value.role || null,
          content: value.content || null,
          avatar: value.avatar || null,
          videoUrl: value.videoUrl || null,
          url: value.url || null,
        };

        if (isEditing && selectedTestimonial?.id) {
          response = await testimonialApi.update(
            selectedTestimonial.id,
            submitData as unknown as Record<string, unknown>
          );
        } else {
          response = await testimonialApi.create(
            submitData as unknown as Record<string, unknown>
          );
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Testimonial updated successfully"
            : "Testimonial created successfully"
        );
        form.reset();
        setCountryIds([]);
        setDestinationIds([]);
        setUniversityIds([]);
        setEventIds([]);
        onClose();
        onSuccess?.();
      } catch (err) {
        toast.error("Request failed");
        console.error(err);
      }
    },
  });

  // type and mediaType are now managed via local state

  useEffect(() => {
    if (selectedTestimonial) {
      const initialCountryIds = selectedTestimonial.countries?.map((c) => c.countryId) || [];
      const initialDestinationIds = selectedTestimonial.destinations?.map((d) => d.destinationId) || [];
      const initialUniversityIds = selectedTestimonial.universities?.map((u) => u.universityId) || [];
      const initialEventIds = selectedTestimonial.events?.map((e) => e.eventId) || [];

      setCountryIds(initialCountryIds);
      setDestinationIds(initialDestinationIds);
      setUniversityIds(initialUniversityIds);
      setEventIds(initialEventIds);

      // Update local state for conditional rendering
      setType(selectedTestimonial.type || "STUDENT");
      setMediaType(selectedTestimonial.mediaType || "TEXT_ONLY");

      const values: Partial<FormData> = {
        type: selectedTestimonial.type || "STUDENT",
        mediaType: selectedTestimonial.mediaType || "TEXT_ONLY",
        name: selectedTestimonial.name || "",
        role: selectedTestimonial.role || "",
        content: selectedTestimonial.content || "",
        rating: selectedTestimonial.rating || 5,
        avatar: selectedTestimonial.avatar || "",
        videoUrl: selectedTestimonial.videoUrl || "",
        url: selectedTestimonial.url || "",
        isFeatured: selectedTestimonial.isFeatured || false,
        order: selectedTestimonial.order || 0,
        countryIds: initialCountryIds,
        destinationIds: initialDestinationIds,
        universityIds: initialUniversityIds,
        eventIds: initialEventIds,
      };

      (Object.keys(values) as Array<keyof FormData>).forEach((key) => {
        if (values[key] !== undefined) {
          form.setFieldValue(key, values[key]);
        }
      });
    } else {
      setCountryIds([]);
      setDestinationIds([]);
      setUniversityIds([]);
      setEventIds([]);
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTestimonial]);

  const handleEntityToggle = (
    entityId: string,
    currentIds: string[],
    setIds: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: keyof FormData
  ) => {
    const newIds = currentIds.includes(entityId)
      ? currentIds.filter((id) => id !== entityId)
      : [...currentIds, entityId];
    setIds(newIds);
    form.setFieldValue(fieldName, newIds);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Testimonial" : "Add Testimonial"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          {/* Type and Media Type Row */}
          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="type">
              {(field) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: "STUDENT" | "REPRESENTATIVE" | "GMB") => {
                      field.handleChange(val);
                      setType(val);
                    }}
                  >
                    <SelectTrigger className="border border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-200">
                      <SelectItem value="STUDENT">Student Review</SelectItem>
                      <SelectItem value="REPRESENTATIVE">Representative</SelectItem>
                      <SelectItem value="GMB">GMB Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.AppField>

            <form.AppField name="mediaType">
              {(field) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Media Type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: "IMAGE" | "VIDEO" | "TEXT_ONLY") => {
                      field.handleChange(val);
                      setMediaType(val);
                    }}
                  >
                    <SelectTrigger className="border border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-200">
                      <SelectItem value="TEXT_ONLY">Text Only</SelectItem>
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.AppField>
          </div>

          {/* Name and Role/Rating Row */}
          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="name">
              {(field) => <field.Input label="Name / Author" />}
            </form.AppField>

            {type === "REPRESENTATIVE" && (
              <form.AppField name="role">
                {(field) => <field.Input label="Role / Title" />}
              </form.AppField>
            )}

            {type === "STUDENT" && (
              <form.AppField name="rating">
                {(field) => (
                  <field.Select label="Rating (1-5)">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num} Stars
                      </SelectItem>
                    ))}
                  </field.Select>
                )}
              </form.AppField>
            )}
          </div>

          {/* Content */}
          <form.AppField name="content">
            {(field) => <field.Textarea label="Content / Message" />}
          </form.AppField>

          {/* Media & Links Section */}
          <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
            <h3 className="font-semibold text-sm">Media & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.AppField name="avatar">
                {(field) => (
                  <ImageUpload
                    value={field.state.value || ""}
                    onChange={field.handleChange}
                    label={mediaType === "VIDEO" ? "Thumbnail" : "Profile Image"}
                    folder="testimonials"
                    onUploadingChange={setIsUploading}
                  />
                )}
              </form.AppField>

              <div className="space-y-4">
                {(mediaType === "VIDEO" || type === "REPRESENTATIVE") && (
                  <form.AppField name="videoUrl">
                    {(field) => <field.Input label="Video URL (YouTube/Vimeo)" />}
                  </form.AppField>
                )}

                {(type === "GMB" || type === "REPRESENTATIVE") && (
                  <form.AppField name="url">
                    {(field) => <field.Input label="External Link (Original Source)" />}
                  </form.AppField>
                )}
              </div>
            </div>
          </div>

          {/* Associations Section */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold text-sm">Associations (Where to display)</h3>
            <Tabs defaultValue="countries" className="w-full">
              <TabsList>
                <TabsTrigger value="countries">Countries</TabsTrigger>
                <TabsTrigger value="destinations">Destinations</TabsTrigger>
                <TabsTrigger value="universities">Universities</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <div className="pt-4 max-h-[200px] overflow-y-auto">
                <TabsContent value="countries" className="mt-0">
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
                </TabsContent>

                <TabsContent value="destinations" className="mt-0">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {destinations.map((d) => (
                        <div key={d.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dest-${d.id}`}
                            checked={destinationIds.includes(d.id)}
                            onCheckedChange={() =>
                              handleEntityToggle(d.id, destinationIds, setDestinationIds, "destinationIds")
                            }
                          />
                          <Label htmlFor={`dest-${d.id}`} className="text-sm cursor-pointer">
                            {d.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="universities" className="mt-0">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {universities.map((u) => (
                        <div key={u.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`uni-${u.id}`}
                            checked={universityIds.includes(u.id)}
                            onCheckedChange={() =>
                              handleEntityToggle(u.id, universityIds, setUniversityIds, "universityIds")
                            }
                          />
                          <Label htmlFor={`uni-${u.id}`} className="text-sm cursor-pointer">
                            {u.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="events" className="mt-0">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {events.map((e) => (
                        <div key={e.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`event-${e.id}`}
                            checked={eventIds.includes(e.id)}
                            onCheckedChange={() =>
                              handleEntityToggle(e.id, eventIds, setEventIds, "eventIds")
                            }
                          />
                          <Label htmlFor={`event-${e.id}`} className="text-sm cursor-pointer">
                            {e.title || e.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Featured and Order Row */}
          <div className="flex items-center gap-4">
            <form.AppField name="isFeatured">
              {(field) => (
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    checked={field.state.value as boolean}
                    onCheckedChange={(checked) => field.handleChange(checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label>Featured</Label>
                  </div>
                </div>
              )}
            </form.AppField>

            <form.AppField name="order">
              {(field) => <field.Input label="Order" type="number" />}
            </form.AppField>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default TestimonialFormModal;
