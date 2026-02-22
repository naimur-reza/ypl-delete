"use client";

import { useState } from "react";
import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
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

interface Service {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
  order: number;
  isActive: boolean;
}

const defaultValues: Service = {
  title: "", slug: "", description: "", icon: "briefcase",
  features: [], image: "", order: 0, isActive: true,
};

export default function ServicesPage() {
  const { items, isLoading, create, update, remove } = useCrud<Service>("/api/services");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [form, setForm] = useState<Service>(defaultValues);
  const [featureInput, setFeatureInput] = useState("");

  const openCreate = () => { setEditing(null); setForm(defaultValues); setFeatureInput(""); setModalOpen(true); };
  const openEdit = (item: Service) => { setEditing(item); setForm(item); setFeatureInput(""); setModalOpen(true); };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };
  const removeFeature = (i: number) => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editing?._id
      ? await update(editing._id, form)
      : await create(form);
    if (ok) setModalOpen(false);
  };

  const columns: Column<Service>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "slug", label: "Slug" },
    { key: "icon", label: "Icon" },
    { key: "order", label: "Order", sortable: true },
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
        icon={Briefcase}
        title="Services"
        description="Manage recruitment services"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Service
          </Button>
        }
      />

      <DataTable
        title="All Services"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["title", "slug"]}
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
        title={editing ? "Edit Service" : "Add Service"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://example.com/image.jpg" />
          </div>
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add a feature" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} />
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>Add</Button>
            </div>
            {form.features.length > 0 && (
              <ul className="mt-2 space-y-1">
                {form.features.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded bg-muted px-3 py-1.5 text-sm">
                    <span>{f}</span>
                    <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700 text-xs ml-2">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
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
        title="Delete Service"
      />
    </div>
  );
}
