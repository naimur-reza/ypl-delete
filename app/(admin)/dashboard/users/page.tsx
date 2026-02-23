"use client";

import { useState } from "react";
import { Users, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import {
  SelectItem,
} from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-field-context";

interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "manager";
  isActive: boolean;
}

const roleColors: Record<string, string> = {
  superadmin: "bg-violet-500/10 text-violet-600 border-violet-200",
  admin: "bg-blue-500/10 text-blue-600 border-blue-200",
  manager: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
};

export default function UsersPage() {
  const { items, isLoading, create, update, remove } = useCrud<User>("/api/users");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: User) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const columns: Column<User>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (item) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
            roleColors[item.role]
          }`}
        >
          {item.role}
        </span>
      ),
    },
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
        icon={Users}
        title="User Management"
        description="Manage admin users and roles"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        }
      />

      <DataTable
        title="All Users"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["name", "email"]}
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
        title={editingItem ? "Edit User" : "Add User"}
      >
        <UserForm
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
        title="Delete User"
      />
    </div>
  );
}

function UserForm({
  editingItem,
  onSuccess,
  create,
  update,
}: {
  editingItem: User | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: editingItem
      ? { ...editingItem, password: "" }
      : {
          name: "",
          email: "",
          password: "",
          role: "manager",
          isActive: true,
        },
    onSubmit: async ({ value }: { value: any }) => {
      const payload = { ...value };
      if (!payload.password) delete payload.password;
      
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
        <form.AppField name="name">
          {(field: any) => <field.Input label="Full Name" required />}
        </form.AppField>

        <form.AppField name="email">
          {(field: any) => <field.Input label="Email Address" type="email" required />}
        </form.AppField>

        <form.AppField name="password">
          {(field: any) => (
            <field.Input
              label={editingItem ? "New Password (leave blank to keep)" : "Password"}
              type="password"
              required={!editingItem}
            />
          )}
        </form.AppField>

        <form.AppField name="role">
          {(field: any) => (
            <field.Select label="Role" required>
              <SelectItem value="superadmin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </field.Select>
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
                editingItem ? "Update User" : "Create User"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
