"use client";

import { LayoutDashboard, Plus, Pencil, Trash2, MoveUp, MoveDown, Eye, EyeOff, Users as UsersIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { useState } from "react";
import Image from "next/image";
import { useAppForm } from "@/hooks/use-field-context";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function TeamDashboardPage() {
  const { items, isLoading, create, update, remove } = useCrud<TeamMember>("/api/team");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingItem(member);
    setIsModalOpen(true);
  };

  const toggleActive = async (member: TeamMember) => {
    await update(member._id, { isActive: !member.isActive });
  };

  const moveOrder = async (member: TeamMember, direction: "up" | "down") => {
    const newOrder = direction === "up" ? member.order - 1 : member.order + 1;
    await update(member._id, { order: newOrder });
  };

  const columns: Column<TeamMember>[] = [
    {
      key: "image",
      label: "Profile",
      render: (item) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-muted">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>
      ),
    },
    {
      key: "name",
      label: "Name & Role",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold">{item.name}</span>
          <span className="text-xs text-primary">{item.role}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Switch checked={item.isActive} onCheckedChange={() => toggleActive(item)} />
          {item.isActive ? <Eye className="h-3 w-3 text-emerald-500" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      render: (item) => (
        <div className="flex items-center gap-1">
          <span className="w-4 text-center text-xs font-mono">{item.order}</span>
          <div className="flex flex-col">
            <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => moveOrder(item, "up")}>
              <MoveUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => moveOrder(item, "down")}>
              <MoveDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UsersIcon}
        title="Team Management"
        description="Manage your leadership and team members"
        action={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        }
      />

      <DataTable
        title="Team Members"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["name", "role", "bio"]}
        actions={(item) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(item)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <CrudModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Team Member" : "New Team Member"}
        className="max-w-4xl"
      >
        <TeamForm
          editingItem={editingItem}
          onSuccess={() => setIsModalOpen(false)}
          create={create}
          update={update}
        />
      </CrudModal>

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!._id)}
        title="Delete Team Member?"
      />
    </div>
  );
}

function TeamForm({
  editingItem,
  onSuccess,
  create,
  update,
}: {
  editingItem: TeamMember | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: editingItem || {
      name: "",
      role: "",
      bio: "",
      image: "",
      isActive: true,
      order: 0,
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
      className="space-y-4"
    >
      <form.AppForm>
        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="name">
            {(field: any) => <field.Input label="Full Name" required />}
          </form.AppField>
          <form.AppField name="role">
            {(field: any) => <field.Input label="Role / Position" required />}
          </form.AppField>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <form.AppField name="bio">
            {(field: any) => <field.RichText label="Biography" required />}
          </form.AppField>
          <div className="space-y-2">
            <span className="text-sm font-medium">Live Preview</span>
            <div className="rounded-md border border-input p-4 min-h-[150px] max-h-[200px] overflow-y-auto bg-muted/10">
              <form.Subscribe selector={(state: any) => state.values.bio}>
                {(bio: string) => <SafeHtmlContent content={bio} />}
              </form.Subscribe>
            </div>
          </div>
        </div>

        <form.AppField name="image">
          {(field: any) => <field.ImageUpload label="Profile Image" />}
        </form.AppField>

        <div className="flex items-center gap-6">
          <form.AppField name="isActive">
            {(field: any) => <field.Checkbox label="Active Status" />}
          </form.AppField>
          <form.AppField name="order">
            {(field: any) => (
              <field.Input
                label="Display Order"
                type="number"
                className="w-24"
                onChange={(e: any) => field.handleChange(Number(e.target.value))}
              />
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
                editingItem ? "Save Changes" : "Create Member"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
