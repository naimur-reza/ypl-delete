/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { CountrySelect } from "@/components/ui/region-select";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/hooks/hooks";
import { toast } from "sonner";
import z from "zod";
import { createRestEntityApi } from "@/lib/api-client";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  url: z.string().url("Valid video URL required"),
  thumbnail: z.string().url().optional().nullable(),
  countryIds: z.array(z.string()).optional().nullable(),
  destinationIds: z.array(z.string()).optional().nullable(),
  universityIds: z.array(z.string()).optional().nullable(),
  eventIds: z.array(z.string()).optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
});

type FormData = z.infer<typeof schema>;

const api = createRestEntityApi<{ id: string }>("/api/representative-videos");

export default function RepresentativeVideoFormModal({
  isEditing,
  selected,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selected?: { id: string } & Partial<{
    title: string;
    url: string;
    thumbnail?: string;
    countries: string[];
    destinations: string[];
    universities: string[];
    events: string[];
    status?: "ACTIVE" | "DRAFT";
  }>;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const isOpen = true;
  const [imageUrl, setImageUrl] = useState<string>(selected?.thumbnail || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [isGlobal, setIsGlobal] = useState<boolean>((selected as any)?.isGlobal || false);
  const [destinationIds, setDestinationIds] = useState<string[]>([]);
  const [universityIds, setUniversityIds] = useState<string[]>([]);
  const [eventIds, setEventIds] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<
    { id: string; name: string }[]
  >([]);
  const [universities, setUniversities] = useState<
    { id: string; name: string }[]
  >([]);
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    setImageUrl(selected?.thumbnail || "");
    setCountryIds(selected?.countries?.map((c: any) => c.country.id) || []);
    setDestinationIds(
      selected?.destinations?.map((d: any) => d.destination.id) || []
    );
    setUniversityIds(
      selected?.universities?.map((u: any) => u.university.id) || []
    );
    setEventIds(selected?.events?.map((e: any) => e.event.id) || []);
    setIsGlobal((selected as any)?.isGlobal || false);
  }, [selected]);

  useEffect(() => {
    const load = async () => {
      try {
        const [dRes, uRes, eRes] = await Promise.all([
          apiClient.get<{ data: { id: string; name: string }[] }>(
            "/api/destinations",
            { limit: "1000" }
          ),
          apiClient.get<{ data: { id: string; name: string }[] }>(
            "/api/universities",
            { limit: "1000" }
          ),
          apiClient.get<{ data: { id: string; title: string }[] }>(
            "/api/events",
            { limit: "1000" }
          ),
        ]);
        if (dRes.data) {
          const arr = Array.isArray(dRes.data)
            ? dRes.data
            : dRes.data.data || [];
          setDestinations(arr);
        }
        if (uRes.data) {
          const arr = Array.isArray(uRes.data)
            ? uRes.data
            : uRes.data.data || [];
          setUniversities(arr);
        }
        if (eRes.data) {
          const arr = Array.isArray(eRes.data)
            ? eRes.data
            : eRes.data.data || [];
          setEvents(arr);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const form = useAppForm({
    defaultValues: {
      title: selected?.title || "",
      url: selected?.url || "",
      thumbnail: selected?.thumbnail || "",
      countryIds: [],
      destinationIds: [],
      universityIds: [],
      eventIds: [],
      status: (selected?.status as "ACTIVE" | "DRAFT") || "ACTIVE",
    } as unknown as FormData,
    validators: { onSubmit: schema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const payload = {
          title: value.title,
          url: value.url,
          thumbnail: imageUrl || null,
          status: value.status || "ACTIVE",
          countryIds: isGlobal ? [] : countryIds,
          isGlobal: isGlobal,
          destinationIds,
          universityIds,
          eventIds,
        } as Record<string, unknown>;
         
        const res =
          isEditing && selected?.id
            ? await api.update(selected.id, payload)
            : await api.create(payload);

        if (res.error) return toast.error(res.error);
        toast.success(isEditing ? "Video updated" : "Video created");
        onClose();
        onSuccess?.();
      } catch (e) {
        toast.error("Request failed");
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      title={
        isEditing ? "Edit Representative Video" : "Add Representative Video"
      }
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
          <form.AppField name="url">
            {(field) => <field.Input label="Video URL" />}
          </form.AppField>
          <form.AppField name="status">
            {(field) => (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(val: "ACTIVE" | "DRAFT") =>
                    field.handleChange(val)
                  }
                >
                  <SelectTrigger className="border border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.AppField>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="services"
            label="Service Image"
            onUploadingChange={setIsUploading}
          />
          <div className="space-y-3">
            <Label className="text-sm font-medium">Countries</Label>
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">Destinations</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {destinations.map((d) => {
                const isChecked = destinationIds.includes(d.id);
                return (
                  <div key={d.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`dest-${d.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setDestinationIds((prev) => [...prev, d.id]);
                        } else {
                          setDestinationIds((prev) =>
                            prev.filter((x) => x !== d.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`dest-${d.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {d.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Universities</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {universities.map((u) => {
                const isChecked = universityIds.includes(u.id);
                return (
                  <div key={u.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`uni-${u.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUniversityIds((prev) => [...prev, u.id]);
                        } else {
                          setUniversityIds((prev) =>
                            prev.filter((x) => x !== u.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`uni-${u.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {u.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Events</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {events.map((e) => {
                const isChecked = eventIds.includes(e.id);
                return (
                  <div key={e.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`event-${e.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEventIds((prev) => [...prev, e.id]);
                        } else {
                          setEventIds((prev) => prev.filter((x) => x !== e.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={`event-${e.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {e.title}
                    </label>
                  </div>
                );
              })}
            </div>
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
              isUploading={isUploading}
              submitText={isEditing ? "Update" : "Create"}
              submittingText={isEditing ? "Updating..." : "Creating..."}
            />
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
}
