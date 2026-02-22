"use client";

import { useState } from "react";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";

interface Branch {
  _id?: string;
  name: string;
  slug: string;
  location: string;
  contactEmail: string;
  isActive: boolean;
}

const defaultValues: Branch = {
  name: "", slug: "", location: "", contactEmail: "", isActive: true,
};

export default function BranchesPage() {
  const { items, isLoading, create, update, remove } = useCrud<Branch>("/api/branches");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [form, setForm] = useState<Branch>(defaultValues);

  const openCreate = () => { setEditing(null); setForm(defaultValues); setModalOpen(true); };
  const openEdit = (item: Branch) => { setEditing(item); setForm(item); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editing?._id
      ? await update(editing._id, form)
      : await create(form);
    if (ok) setModalOpen(false);
  };

  const columns: Column<Branch>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "location", label: "Location", sortable: true },
    { key: "contactEmail", label: "Email" },
    {
      key: "isActive", label: "Status",
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
        icon={Building2}
        title="Branches"
        description="Manage office branches"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Branch
          </Button>
        }
      />

      <DataTable
        title="All Branches"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["name", "location"]}
        actions={(item) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
      />

      <CrudModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Branch" : "Add Branch"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            <Label>Active</Label>
          </div>
          <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
        </form>
      </CrudModal>

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!._id!)}
        title="Delete Branch"
      />
    </div>
  );
}
