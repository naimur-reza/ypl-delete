"use client";

import { useState, useEffect } from "react";
import { UserCheck, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-field-context";

interface Department {
  _id: string;
  name: string;
}

interface Role {
  _id?: string;
  name: string;
  slug: string;
  departmentId: string;
  order: number;
  isActive: boolean;
}

export default function RolesPage() {
  const { items, isLoading, create, update, remove } = useCrud<Role>("/api/roles");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: Role) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const columns: Column<Role>[] = [
    { key: "name", label: "Name", sortable: true },
    {
      key: "departmentId",
      label: "Department",
      render: (item) =>
        departments.find((d) => d._id === item.departmentId)?.name || "Unknown",
    },
    { key: "slug", label: "Slug" },
    { key: "order", label: "Order", sortable: true },
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
        icon={UserCheck}
        title="Roles"
        description="Manage roles for salary guide"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Role
          </Button>
        }
      />

      <DataTable
        title="All Roles"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["name", "slug"]}
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
        title={editingItem ? "Edit Role" : "Add Role"}
      >
        <RoleForm
          editingItem={editingItem}
          departments={departments}
          onSuccess={() => setModalOpen(false)}
          create={create}
          update={update}
        />
      </CrudModal>

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!._id!)}
        title="Delete Role"
      />
    </div>
  );
}

function RoleForm({
  editingItem,
  departments,
  onSuccess,
  create,
  update,
}: {
  editingItem: Role | null;
  departments: Department[];
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: editingItem || {
      name: "",
      slug: "",
      departmentId: "",
      order: 0,
      isActive: true,
    },
    onSubmit: async ({ value }: { value: any }) => {
      if (!value.departmentId) {
        alert("Please select a department");
        return;
      }
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
      className="space-y-4"
    >
      <form.AppForm>
        <form.AppField name="departmentId">
          {(field: any) => (
            <field.Select label="Department" required>
              {departments.map((d) => (
                <SelectItem key={d._id} value={d._id}>
                  {d.name}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>

        <form.AppField name="name">
          {(field: any) => (
            <field.Input
              label="Role Name"
              required
              onChange={(e: any) => {
                const val = e.target.value;
                field.handleChange(val);
                if (!editingItem) {
                  form.setFieldValue("slug", val.toLowerCase().replace(/\s+/g, "-"));
                }
              }}
            />
          )}
        </form.AppField>

        <form.AppField name="slug">
          {(field: any) => <field.Input label="Slug" required />}
        </form.AppField>

        <form.AppField name="order">
          {(field: any) => (
            <field.Input
              label="Display Order"
              type="number"
              onChange={(e: any) => field.handleChange(Number(e.target.value))}
            />
          )}
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
                editingItem ? "Update Role" : "Create Role"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
