"use client";

import { useState } from "react";
import { GraduationCap, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { useAppForm } from "@/hooks/use-field-context";
import { SelectItem } from "@/components/ui/select";

interface Career {
  _id?: string;
  title: string;
  slug: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  salary: string;
  category: string;
  department: string;
  postedDate: string;
  isActive: boolean;
}

export default function CareersPage() {
  const { items, isLoading, create, update, remove } = useCrud<Career>("/api/careers");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Career | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null);

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: Career) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const columns: Column<Career>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
    { key: "type", label: "Type" },
    { key: "category", label: "Category" },
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
        icon={GraduationCap}
        title="Careers"
        description="Manage job postings and career opportunities"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Career
          </Button>
        }
      />

      <DataTable
        title="All Careers"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["title", "company", "location", "category"]}
        actions={(item) => (
          <div className="flex gap-2">
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
        title={editingItem ? "Edit Career" : "Add Career"}
        className="max-w-3xl"
      >
        <CareerForm
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
        title="Delete Career"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}

function CareerForm({
  editingItem,
  onSuccess,
  create,
  update,
}: {
  editingItem: Career | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: editingItem || {
      title: "",
      slug: "",
      company: "",
      description: "",
      requirements: [],
      location: "",
      type: "Full-time",
      salary: "",
      category: "",
      department: "",
      postedDate: new Date().toISOString().split("T")[0],
      isActive: true,
    },
    onSubmit: async ({ value }: { value: any }) => {
      const payload = { ...value };
      if (!payload.slug) {
        payload.slug = payload.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }
      const ok = editingItem?._id
        ? await update(editingItem._id, payload)
        : await create(payload);
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
      className="space-y-4"
    >
      <form.AppForm>
        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="title">
            {(field: any) => (
              <field.Input
                label="Job Title"
                required
                onChange={(e: any) => {
                  const val = e.target.value;
                  field.handleChange(val);
                  if (!editingItem) {
                    form.setFieldValue(
                      "slug",
                      val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                    );
                  }
                }}
              />
            )}
          </form.AppField>
          <form.AppField name="company">
            {(field: any) => <field.Input label="Company" />}
          </form.AppField>
        </div>

        <form.AppField name="slug">
          {(field: any) => <field.Input label="Slug (URL)" required />}
        </form.AppField>

        <form.AppField name="description">
          {(field: any) => <field.RichText label="Job Description" required />}
        </form.AppField>

        <form.AppField name="requirements">
          {(field: any) => <field.MultiInput label="Requirements List" />}
        </form.AppField>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="location">
            {(field: any) => <field.Input label="Location" required />}
          </form.AppField>
          <form.AppField name="category">
            {(field: any) => <field.Input label="Category" placeholder="e.g. Technology" />}
          </form.AppField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="type">
            {(field: any) => (
              <field.Select label="Job Type">
                {["Full-time", "Part-time", "Contract", "Temporary"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="salary">
            {(field: any) => <field.Input label="Salary Range" />}
          </form.AppField>
        </div>

        <form.AppField name="department">
          {(field: any) => <field.Input label="Department" />}
        </form.AppField>

        <form.AppField name="isActive">
          {(field: any) => <field.Checkbox label="Active Status" />}
        </form.AppField>

        <form.Subscribe selector={(state: any) => state.isSubmitting}>
          {(isSubmitting: any) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingItem ? "Update Career" : "Create Career"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
