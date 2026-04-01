"use client";

import { useState } from "react";
import { Briefcase, Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { useAppForm } from "@/hooks/use-field-context";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";
import Image from "next/image";
import Link from "next/link";

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  features: string[];
  image: string;
  order: number;
  isActive: boolean;
}

export default function ServicesPage() {
  // Include inactive services so admins can view and re-enable them.
  const { items, isLoading, create, update, remove } = useCrud<Service>("/api/services?includeInactive=1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingItem(service);
    setIsModalOpen(true);
  };

  const toggleActive = async (service: Service) => {
    await update(service._id, { isActive: !service.isActive });
  };

  const columns: Column<Service>[] = [
    {
      key: "image",
      label: "Image",
      render: (item) => (
        <div className="relative h-10 w-16 overflow-hidden rounded border border-border bg-muted">
          <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
        </div>
      ),
    },
    {
      key: "title",
      label: "Service Title",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold">{item.title}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{item.slug}</span>
        </div>
      ),
    },
    {
      key: "icon",
      label: "Icon",
      render: (item) => <Badge variant="outline" className="text-[10px]">{item.icon}</Badge>,
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
    { key: "order", label: "Order", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Briefcase}
        title="Services"
        description="Manage recruitment and career services"
        action={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        }
      />

      <DataTable
        title="All Services"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["title", "slug", "description"]}
        actions={(item) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" asChild>
              <Link href={`/dashboard/services/${item._id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
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
        title={editingItem ? "Edit Service" : "New Service"}
        className="max-w-4xl"
      >
        <ServiceForm
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
        title="Delete Service?"
      />
    </div>
  );
}

function ServiceForm({
  editingItem,
  onSuccess,
  create,
  update,
}: {
  editingItem: Service | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: editingItem || {
      title: "",
      slug: "",
      description: "",
      content: "",
      icon: "briefcase",
      features: [],
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

  const handleTitleChange = (title: string) => {
    form.setFieldValue("title", title);
    if (!editingItem) {
      form.setFieldValue("slug", title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""));
    }
  };

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
                label="Service Title" 
                required 
                onChange={(e: any) => handleTitleChange(e.target.value)}
              />
            )}
          </form.AppField>
          <form.AppField name="slug">
            {(field: any) => <field.Input label="Slug (URL)" required />}
          </form.AppField>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <form.AppField name="description">
            {(field: any) => <field.RichText label="Short Description (Listing)" required />}
          </form.AppField>
          <div className="space-y-2">
            <span className="text-sm font-medium">Live Preview</span>
            <div className="rounded-md border border-input p-4 min-h-[100px] max-h-[150px] overflow-y-auto bg-muted/10">
              <form.Subscribe selector={(state: any) => state.values.description}>
                {(desc: string) => <SafeHtmlContent content={desc} />}
              </form.Subscribe>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="icon">
            {(field: any) => <field.Input label="Icon Name (Lucide)" />}
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
        </div>

        <form.AppField name="image">
          {(field: any) => <field.ImageUpload label="Service Image" />}
        </form.AppField>

        <form.AppField name="features">
          {(field: any) => <field.MultiInput label="Features List" />}
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
                  {editingItem ? "Saving..." : "Creating..."}
                </>
              ) : (
                editingItem ? "Save Changes" : "Create Service"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
