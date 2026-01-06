/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { globalOfficeSchema } from "@/schemas/global-office";
import { toast } from "sonner";
import { createEntityApi } from "@/lib/api-client";
import { CountrySelect } from "@/components/ui/region-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

type GlobalOfficeWithCountries = {
  id: string;
  name: string;
  subtitle?: string | null;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mapEmbedUrl?: string | null;
  openingHours?: any;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  countries?: Array<{ country: { id: string } }>;
};

const globalOfficeApi = createEntityApi<GlobalOfficeWithCountries>(
  "/api/global-offices"
);

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const GlobalOfficeFormModal = ({
  isEditing,
  selectedGlobalOffice,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedGlobalOffice?: GlobalOfficeWithCountries;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [openingHours, setOpeningHours] = useState<Record<string, any>>({});
  const [content, setContent] = useState<string>("");

  const form = useAppForm({
    defaultValues: {
      name: selectedGlobalOffice?.name || "",
      subtitle: selectedGlobalOffice?.subtitle || "",
      slug: selectedGlobalOffice?.slug || "",
      email: selectedGlobalOffice?.email || "",
      phone: selectedGlobalOffice?.phone || "",
      address: selectedGlobalOffice?.address || "",
      latitude: selectedGlobalOffice?.latitude?.toString() || "",
      longitude: selectedGlobalOffice?.longitude?.toString() || "",
      mapEmbedUrl: selectedGlobalOffice?.mapEmbedUrl || "",
      content: selectedGlobalOffice?.content || "",
      metaTitle: selectedGlobalOffice?.metaTitle || "",
      metaDescription: selectedGlobalOffice?.metaDescription || "",
      metaKeywords: selectedGlobalOffice?.metaKeywords || "",
    } as any,
    validators: { onSubmit: globalOfficeSchema as any },
    onSubmit: async ({ value }) => {
      try {
        let response;

        // Convert latitude and longitude strings to numbers or null
        const latitudeValue =
          value.latitude === "" ||
          value.latitude === null ||
          value.latitude === undefined
            ? null
            : typeof value.latitude === "string"
            ? value.latitude.trim() === ""
              ? null
              : parseFloat(value.latitude)
            : value.latitude;

        const longitudeValue =
          value.longitude === "" ||
          value.longitude === null ||
          value.longitude === undefined
            ? null
            : typeof value.longitude === "string"
            ? value.longitude.trim() === ""
              ? null
              : parseFloat(value.longitude)
            : value.longitude;

        // Validate coordinates if provided
        if (
          latitudeValue !== null &&
          (isNaN(latitudeValue) || latitudeValue < -90 || latitudeValue > 90)
        ) {
          toast.error("Latitude must be a valid number between -90 and 90");
          return;
        }

        if (
          longitudeValue !== null &&
          (isNaN(longitudeValue) ||
            longitudeValue < -180 ||
            longitudeValue > 180)
        ) {
          toast.error("Longitude must be a valid number between -180 and 180");
          return;
        }

        const submitData = {
          ...value,
          latitude: latitudeValue,
          longitude: longitudeValue,
          openingHours:
            Object.keys(openingHours).length > 0 ? openingHours : null,
          content: content || null,
          countryIds,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
        };

        if (isEditing && selectedGlobalOffice?.id) {
          response = await globalOfficeApi.update(
            selectedGlobalOffice.id,
            submitData
          );
        } else {
          response = await globalOfficeApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "Global office updated successfully"
            : "Global office created successfully"
        );
        form.reset();
        setCountryIds([]);
        setOpeningHours({});
        setContent("");
        onClose();
        onSuccess?.();
      } catch (err: any) {
        // Handle Zod validation errors
        if (err?.issues && Array.isArray(err.issues)) {
          const firstError = err.issues[0];
          toast.error(firstError.message || "Validation error");
          return;
        }

        // Handle API errors
        if (err?.response?.error) {
          toast.error(err.response.error);
          return;
        }

        toast.error(err?.message || "Request failed");
        console.error(err);
      }
    },
  });

  useEffect(() => {
    if (selectedGlobalOffice) {
      form.setFieldValue("name", selectedGlobalOffice.name || "");
      form.setFieldValue("subtitle", selectedGlobalOffice.subtitle || "");
      form.setFieldValue("slug", selectedGlobalOffice.slug || "");
      form.setFieldValue("email", selectedGlobalOffice.email || "");
      form.setFieldValue("phone", selectedGlobalOffice.phone || "");
      form.setFieldValue("address", selectedGlobalOffice.address || "");
      form.setFieldValue(
        "latitude",
        selectedGlobalOffice.latitude?.toString() || ""
      );
      form.setFieldValue(
        "longitude",
        selectedGlobalOffice.longitude?.toString() || ""
      );
      form.setFieldValue("mapEmbedUrl", selectedGlobalOffice.mapEmbedUrl || "");
      setContent(selectedGlobalOffice.content || "");
      form.setFieldValue("metaTitle", selectedGlobalOffice.metaTitle || "");
      form.setFieldValue(
        "metaDescription",
        selectedGlobalOffice.metaDescription || ""
      );
      form.setFieldValue(
        "metaKeywords",
        selectedGlobalOffice.metaKeywords || ""
      );

      // Set country IDs
      if (selectedGlobalOffice.countries) {
        setCountryIds(selectedGlobalOffice.countries.map((c) => c.country.id));
      }

      // Set opening hours
      if (selectedGlobalOffice.openingHours) {
        setOpeningHours(
          selectedGlobalOffice.openingHours as Record<string, any>
        );
      }
    } else {
      form.reset();
      setCountryIds([]);
      setOpeningHours({});
      setContent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGlobalOffice]);

  const handleDayChange = (
    day: string,
    field: "open" | "close" | "closed",
    value: any
  ) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: field === "closed" ? value : value || "",
      },
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Global Office" : "Add Global Office"}
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
            {(field) => <field.Input label="Name" />}
          </form.AppField>
          <form.AppField name="subtitle">
            {(field) => <field.Input label="Subtitle" />}
          </form.AppField>
          <form.AppField name="slug">
            {(field) => <field.Input label="Slug" />}
          </form.AppField>

          <div className=" pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Contact Details</h3>
            <form.AppField name="email">
              {(field) => <field.Input label="Email" />}
            </form.AppField>
            <form.AppField name="phone">
              {(field) => <field.Input label="Phone" />}
            </form.AppField>
          </div>

          <div className=" pt-4 mt-4">
            <form.AppField name="address">
              {(field) => <field.Textarea label="Address" />}
            </form.AppField>
            <div className="grid grid-cols-2 gap-4 my-4">
              <form.AppField name="latitude">
                {(field) => <field.Input label="Latitude" />}
              </form.AppField>
              <form.AppField name="longitude">
                {(field) => <field.Input label="Longitude" />}
              </form.AppField>
            </div>
            <form.AppField name="mapEmbedUrl">
              {(field) => <field.Input label="Map Embed URL" />}
            </form.AppField>
          </div>

          <div className="pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Content</h3>
            <RichTextEditor
              value={content}
              onChange={setContent}
              label="Office Content"
              placeholder="Enter detailed information about this office..."
            />
          </div>

          <div className="pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Opening Hours</h3>{" "}
            <div className="space-y-3">
              {daysOfWeek.map((day) => {
                const dayData = openingHours[day.key] || {};
                const isClosed = dayData.closed || false;

                return (
                  <div key={day.key} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">{day.label}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isClosed}
                          onChange={(e) =>
                            handleDayChange(day.key, "closed", e.target.checked)
                          }
                          className="rounded"
                        />
                        <Label className="text-xs">Closed</Label>
                      </div>
                    </div>
                    {!isClosed && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Open Time
                          </Label>
                          <Input
                            type="time"
                            value={dayData.open || ""}
                            onChange={(e) =>
                              handleDayChange(day.key, "open", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Close Time
                          </Label>
                          <Input
                            type="time"
                            value={dayData.close || ""}
                            onChange={(e) =>
                              handleDayChange(day.key, "close", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                    {isClosed && (
                      <div className="text-xs text-muted-foreground italic">
                        Closed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className=" ">
            <CountrySelect
              value={countryIds}
              onChange={setCountryIds}
              label="Select Countries"
            />
          </div>

          <div className=" ">
            <form.AppField name="metaTitle">
              {(field) => <field.Input label="Meta Title" />}
            </form.AppField>
            <form.AppField name="metaDescription">
              {(field) => <field.Textarea label="Meta Description" />}
            </form.AppField>
            <form.AppField name="metaKeywords">
              {(field) => <field.Input label="Meta Keywords" />}
            </form.AppField>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default GlobalOfficeFormModal;
