"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { SelectItem } from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-field-context";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";

interface Event {
  _id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: "webinar" | "workshop" | "meetup" | "other";
  isActive: boolean;
  imageUrl?: string;
  capacity?: number;
  registrationLink?: string;
}

const EVENT_TYPES = [
  { label: "Webinar", value: "webinar" },
  { label: "Workshop", value: "workshop" },
  { label: "Meetup", value: "meetup" },
  { label: "Other", value: "other" },
];

export default function EventsPage() {
  const { items, isLoading, create, update, remove } =
    useCrud<Event>("/api/events");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  const handleEdit = (item: Event) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const columns: Column<Event>[] = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "startDate",
      label: "Starts",
      sortable: true,
      render: (item) => (
        <span className="text-xs">
          {new Date(item.startDate).toLocaleDateString()} {new Date(item.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (item) => <Badge variant="outline" className="capitalize">{item.type}</Badge>,
    },
    { key: "location", label: "Location" },
    {
      key: "isActive",
      label: "Status",
      render: (item) => (
        <Badge variant={item.isActive ? "default" : "secondary"}>
          {item.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Calendar}
        title="Events"
        description="Manage recruitment events and webinars"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        }
      />

      <DataTable
        title="All Events"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["title", "location", "type"]}
        actions={(item) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <CrudModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Event" : "Add Event"}
        className="max-w-4xl"
      >
        <EventForm
          editingItem={editingItem}
          onSuccess={() => setModalOpen(false)}
          create={create}
          update={update}
        />
      </CrudModal>

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!._id!)}
        title="Delete Event"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

function EventForm({
  editingItem,
  onSuccess,
  create,
  update,
}: {
  editingItem: Event | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: editingItem
      ? {
          ...editingItem,
          startDate: editingItem.startDate
            ? new Date(editingItem.startDate).toISOString().slice(0, 16)
            : "",
          endDate: editingItem.endDate
            ? new Date(editingItem.endDate).toISOString().slice(0, 16)
            : "",
        }
      : {
          title: "",
          description: "",
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date().toISOString().slice(0, 16),
          location: "",
          type: "other",
          isActive: true,
          imageUrl: "",
          capacity: 0,
          registrationLink: "",
        },
    onSubmit: async ({ value }: { value: any }) => {
      const ok = editingItem?._id
        ? await update(editingItem._id, value)
        : await create(value);
      if (ok) onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppForm>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <form.AppField name="title">
            {(field: any) => <field.Input label="Event Title" required />}
          </form.AppField>

          <div className=" ">
            <form.AppField name="description">
              {(field: any) => <field.RichText label="Description" required />}
            </form.AppField>
 
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="startDate">
              {(field: any) => (
                <field.Input
                  label="Start Date & Time"
                  type="datetime-local"
                  required
                />
              )}
            </form.AppField>
            <form.AppField name="endDate">
              {(field: any) => (
                <field.Input
                  label="End Date & Time"
                  type="datetime-local"
                  required
                />
              )}
            </form.AppField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="location">
              {(field: any) => <field.Input label="Location" required />}
            </form.AppField>
            <form.AppField name="type">
              {(field: any) => (
                <field.Select label="Event Type">
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </field.Select>
              )}
            </form.AppField>
          </div>

          <form.AppField name="imageUrl">
            {(field: any) => <field.ImageUpload label="Event Image" />}
          </form.AppField>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="capacity">
              {(field: any) => (
                <field.Input
                  label="Capacity"
                  type="number"
                  onChange={(e: any) => field.handleChange(Number(e.target.value))}
                />
              )}
            </form.AppField>
            <form.AppField name="registrationLink">
              {(field: any) => (
                <field.Input
                  label="Registration Link"
                  placeholder="https://..."
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="isActive">
            {(field: any) => (
              <div className="flex items-center gap-2">
                <field.Checkbox label="Active Status" />
              </div>
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
                editingItem ? "Update Event" : "Create Event"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
