"use client";

import { useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/use-field-context";
import { CrudModal } from "./crud-modal";
import { SelectItem } from "@/components/ui/select";

interface Meeting {
  _id?: string;
  title: string;
  description: string;
  startTime: string | Date;
  endTime: string | Date;
  location?: string;
  meetingLink?: string;
  attendees: string[];
  status: "scheduled" | "completed" | "cancelled";
}

interface MeetingModalProps {
  open: boolean;
  onClose: () => void;
  editingItem: Meeting | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}

export function MeetingModal({
  open,
  onClose,
  editingItem,
  onSuccess,
  create,
  update,
}: MeetingModalProps) {
  const initialValues = useMemo(() => editingItem
    ? {
        ...editingItem,
        startTime: new Date(editingItem.startTime),
        endTime: new Date(editingItem.endTime),
      }
    : {
        title: "",
        description: "",
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // Default 1 hour later
        location: "",
        meetingLink: "",
        attendees: [],
        status: "scheduled" as const,
      }, [editingItem]);

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }: { value: any }) => {
      const ok = editingItem?._id
        ? await update(editingItem._id, value)
        : await create(value);
      if (ok) {
        onSuccess();
        onClose();
      }
    },
  });

  // Re-initialize form when initialValues change (e.g. clicking different calendar days)
  useEffect(() => {
    form.reset();
  }, [initialValues, form]);

  return (
    <CrudModal
      open={open}
      onClose={onClose}
      title={editingItem ? "Edit Meeting" : "Schedule Meeting"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.AppForm>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <form.AppField name="title">
              {(field: any) => <field.Input label="Meeting Title" required />}
            </form.AppField>

            <form.AppField name="description">
              {(field: any) => <field.Textarea label="Description" />}
            </form.AppField>

            <div className="">
              <form.AppField name="startTime">
                {(field: any) => (
                  <field.DateTime label="Start Time" required />
                )}
              </form.AppField>
              <form.AppField name="endTime">
                {(field: any) => (
                  <field.DateTime label="End Time" required />
                )}
              </form.AppField>
            </div>

            <form.AppField name="location">
              {(field: any) => <field.Input label="Location" />}
            </form.AppField>

            <form.AppField name="meetingLink">
              {(field: any) => (
                <field.Input label="Meeting Link" placeholder="https://..." />
              )}
            </form.AppField>

            <form.AppField name="attendees">
              {(field: any) => (
                <field.MultiInput label="Attendees (Emails)" />
              )}
            </form.AppField>

            <form.AppField name="status">
              {(field: any) => (
                <field.Select label="Status">
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </field.Select>
              )}
            </form.AppField>
          </div>

          <form.Subscribe selector={(state: any) => state.isSubmitting}>
            {(isSubmitting: any) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingItem ? "Update Meeting" : "Schedule Meeting"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form.AppForm>
      </form>
    </CrudModal>
  );
}
